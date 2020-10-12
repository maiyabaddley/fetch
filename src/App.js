import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import './App.css'

/*
  Utility functions
*/
function byListIdThenName(a, b) {
  if (a.listId === b.listId) {
    // Note: this sort would be a business decision
    // I chose to sort numerically because of the data format
    // it looks much better than the string sort would have
    const [aPre, aNum] = a.name.split('Item ')
    const [bPre, bNum] = b.name.split('Item ')
    return +aNum < +bNum ? -1 : 1
  }
  return a.listId < b.listId ? -1 : 1
}

const sort = (data) => data.sort(byListIdThenName)
// this filters out any 'falsey' name including null, undefined, empty string and 0
const filter = (data) => data.filter(({ name }) => !!name)
// in production code I would use a library with utility functions such as lodash's groupBy
const group = (data) => {
  const groups = {}
  data.forEach((d) => {
    groups[d.listId] = groups[d.listId] || []
    groups[d.listId].push(d)
  })
  return groups
}

/*
  Service/DataLayer functions
*/
function getData() {
  return fetch('https://fetch-hiring.s3.amazonaws.com/hiring.json')
    .then((response) => response.json())
    .then(filter)
    .then(sort)
    .then(group)
}

/*
  Functional Components
*/
function ListItem({ name, listId, id }) {
  return (
    <div data-test-id={id} className="list-item">
      <span>{name}</span>
    </div>
  )
}

function List({ title, values = [], id }) {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <div
      data-test-id={id}
      key={title}
      className={classnames('list-items', { collapsed })}
    >
      <h3 onClick={() => setCollapsed(!collapsed)}>
        {title} <i className="fas fa-caret-up" />
      </h3>
      <span className="item-count-label">{values.length} items</span>
      <div>
        {values.map((v) => (
          <ListItem key={v.id} {...v} />
        ))}
      </div>
    </div>
  )
}

function Loader({ loading }) {
  return <i className="fab fa-loading" />
}

/*
  App component
*/

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    getData().then((groupedData) => {
      setData(groupedData)
      setLoading(false)
    })
  }

  useEffect(fetchData, [])

  return (
    <div className="app">
      <header>
        <img height={128} src="fetch.png" />
      </header>
      <aside>
        <a
          href="https://www.linkedin.com/in/jason-baddley-36167931/"
          target="blank"
        >
          <i className="fab spin fa-linkedin" />
          <span>by Jason Baddley</span>
        </a>
      </aside>
      <div className={classnames('content', { loading })}>
        <div className="loader">
          <i className="fas fa-spin fa-spinner" /> Loading Data
        </div>
        <p>Click on a list toggle its list of items</p>
        {Object.entries(data).map(([listId, values]) => (
          <List
            key={listId}
            id={listId}
            title={`List ${listId}`}
            values={values}
          />
        ))}
      </div>
    </div>
  )
}

export default App
