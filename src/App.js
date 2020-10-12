import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import './App.css'

function byListIdThenName(a, b) {
  if (a.listId === b.listId) {
    // in looking at the data, the format of the name is: Item [number]
    // this could either be sorted by string or by parsing out the number and sorting by number
    // sorting by number will generally look better to the user's eye and easier to find numeric-like data
    // because they will descend numerically, otherwise Item 28 and Item 280 would be next to eachother
    // but this should only be done if the name truly is psuedo-numeric not if the name is merely a title (like the name of a product)
    // without association to the other items
    // because the name is consistent I'm doing the easiest approach, of course I could use RegExp
    const [aPre, aNum] = a.name.split('Item ')
    const [bPre, bNum] = b.name.split('Item ')
    return +aNum < +bNum ? -1 : 1
  }
  return a.listId < b.listId ? -1 : 1
}

const sort = (data) => data.sort(byListIdThenName)
// this filters out any 'falsey' name including null, undefined, empty string and 0
const filter = (data) => data.filter(({ name }) => !!name)
// in production code I would use a library with utility functions such as lodash
const group = (data) => {
  const groups = {}
  data.forEach((d) => {
    groups[d.listId] = groups[d.listId] || []
    groups[d.listId].push(d)
  })
  return groups
}

// I would normally put this into a service or datalayer
function getData() {
  return fetch('https://fetch-hiring.s3.amazonaws.com/hiring.json')
    .then((response) => response.json())
    .then(filter)
    .then(sort)
    .then(group)
}

// I would usually put all functional components into a folder for easy testing
// and resuse
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
        {title} <i className="fas fa-caret-down" />
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
      <h2>Fetch Rewards Coding Exercise</h2>
      <aside>
        <a
          href="https://www.linkedin.com/in/jason-baddley-36167931/"
          target="blank"
        >
          <i className="fab fa-linkedin" />
          <span>by Jason Baddley</span>
        </a>
      </aside>
      <div className={classnames('content', { loading })}>
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
