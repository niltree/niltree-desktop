// Packages
import electron from 'electron'
import React from 'react'
import { ago as timeAgo } from 'time-ago'
import isDev from 'electron-is-dev'

// Components
import Licenses from '../components/about/licenses'

// Utilities
import showError from '../utils/error'
import CloseWindowSVG from '../vectors/close-window'

// Styles
import { mainStyles, globalStyles } from '../styles/pages/about'

class About extends React.PureComponent {
  state = {
    version: null
  }

  remote = electron.remote || false
  isWindows = process.platform === 'win32'

  componentWillMount() {
    if (!this.remote) {
      return
    }

    let version

    if (isDev) {
      version = this.remote.process.env.npm_package_version
    } else {
      version = this.remote.app.getVersion()
    }

    this.setState({ version })
    this.getReleaseDate()
  }

  openLink = event => {
    const link = event.target

    if (!this.remote) {
      return
    }

    this.remote.shell.openExternal(link.href)
    event.preventDefault()
  }

  async getReleaseDate() {
    let data

    try {
      data = await fetch(
        'https://api.github.com/repos/niltree/niltree-desktop/releases'
      )
    } catch (err) {
      console.log(err)
      return
    }

    if (!data.ok) {
      return
    }

    try {
      data = await data.json()
    } catch (err) {
      console.log(err)
      return
    }

    let localRelease

    for (const release of data) {
      if (release.tag_name === this.state.version) {
        localRelease = release
      }
    }

    if (!localRelease) {
      this.setState({
        releaseDate: '(not yet released)'
      })

      return
    }

    const setReleaseDate = () => {
      const ago = timeAgo(new Date(localRelease.published_at))

      this.setState({
        releaseDate: `(${ago})`
      })
    }

    setReleaseDate()

    // Make sure the date stays updated
    setInterval(setReleaseDate, 1000)
  }

  handleTutorial = () => {
    if (!this.remote) {
      return
    }

    const windows = this.remote.getGlobal('windows')

    if (!windows || !windows.tutorial) {
      showError('Not able to open tutorial window')
      return
    }

    windows.tutorial.show()
  }

  handleCloseClick = () => {
    if (!this.remote) {
      return
    }

    const currentWindow = this.remote.getCurrentWindow()
    currentWindow.hide()
  }

  render() {
    return (
      <div>
        {this.isWindows && (
          <div className="window-controls">
            <span onClick={this.handleCloseClick}>
              <CloseWindowSVG />
            </span>
          </div>
        )}
        <section className="wrapper">
          <span className="window-title">About</span>

          <img src="/static/app-icon.png" />

          <h1>Niltree</h1>
          <h2>
            Version {this.state.version ? <b>{this.state.version}</b> : ''}{' '}
            {this.state.releaseDate ? this.state.releaseDate : ''}
          </h2>

          <article>
            <h1>Authors</h1>

            <p>
              <a href="https://twitter.com/theshawwn" onClick={this.openLink}>
                Shawn Presser
              </a>
              <br />
              <a href="https://twitter.com/webmixedreality" onClick={this.openLink}>
                Avaer Kazmer 
              </a>
              <br />
            </p>

            <h1>{'3rd party software'}</h1>
            <Licenses />
          </article>

          <span className="copyright">
            Made by{' '}
            <a href="https://niltree.com" onClick={this.openLink}>
              Niltree
            </a>
          </span>

          <nav>
            <a href="https://niltree.com/docs" onClick={this.openLink}>
              Docs
            </a>
            <a
              href="https://github.com/niltree/niltree-desktop"
              onClick={this.openLink}
            >
              Source
            </a>
            <a onClick={this.handleTutorial}>Tutorial</a>
          </nav>
        </section>

        <style jsx>{mainStyles}</style>
        <style jsx global>
          {globalStyles}
        </style>
      </div>
    )
  }
}

export default About
