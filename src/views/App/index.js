import React from 'react'
import ReactDOM from 'react-dom'
import Tabs from './components/Tabs'
import Spring from '../../helpers/Spring'
import Bar from './components/Bar'
import Page from './components/Page'

import './../../helpers/Arrays'

import './../../app.scss'

const remote = require('electron').remote
const path = require('path')
const app = remote.app

const appData = app.getPath('userData')
const userData = path.join(appData, '/userdata')

window.global = {
  currentWindow: remote.getCurrentWindow(),
  menuWindow: remote.getCurrentWindow().getChildWindows()[0],
  remote: remote,
  tabs: [],
  tabsData: {
    pinnedTabWidth: 32,
    maxTabWidth: 190,
    newTabWidth: 32
  },
  tabsAnimationData: {
    positioningDuration: 0.2,
    hoverDuration: 0.2,
    positioningEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
  },
  defaultOptions: {
    select: true,
    url: 'wexond://newtab'
  },
  excludedURLs: ['wexond://newtab', 'wexond://newtab/'],
  historyPath: userData + '/history.json',
  systembarHeight: 32
}

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      pagesToCreate: []
    }
  }

  componentDidMount () {
    window.addEventListener('contextmenu', function (e) {
      if (e.target.tagName === 'WEBVIEW') {
        global.menuWindow.send('menu:show', e.screenX, e.screenY)
      }
    })
  }

  /**
   * Sets bar text.
   * @param {string} text
   */
  updateBarText = (text) => {
    const bar = this.getBar()
    let contains = false
    // Check if the url from webview is in excluded URLs.
    for (var i = 0; i < global.excludedURLs.length; i++) {
      if (global.excludedURLs[i].indexOf(text) !== -1) {
        contains = true
        break
      }
      if (text.indexOf(global.excludedURLs[i]) !== -1) {
        contains = true
        break
      }
    }
    // check if webview's url is in excluded urls
    if (!contains) {
      // if not, set bar's text to webview's url and unlock bar
      bar.setText(text)
      bar.locked = false
      bar.tempLocked = false
    } else {
      bar.setText('')
      // if it is, check if the url is wexond://newtab
      if (text.startsWith('wexond://newtab')) {
        // if it is, lock and show bar
        bar.locked = true
        bar.show()
      }
    }
  }

  /**
   * Gets this {App}.
   * @return {App}
   */
  getApp = () => {
    return this
  }

  /**
   * Gets Systembar.
   * @return {Systembar}
   */
  getTabs = () => {
    return this.refs.tabs
  }

  /**
   * Gets Bar.
   * @return {Bar}
   */
  getBar = () => {
    return this.refs.bar
  }

  render () {
    return (
      <div>
        <Tabs ref='tabs' getApp={this.getApp} />
        <Bar ref='bar' getApp={this.getApp} />
        {this.state.pagesToCreate.map((data, key) => {
          return (
            <Page getApp={this.getApp} getTab={data.getTab} url={data.url} key={key} />
          )
        })}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
