import React from 'react'
import ReactStars from 'react-stars'
import ReactDatepicker from 'react-datepicker'
import moment from 'moment'
import axios from 'axios'

import 'react-datepicker/dist/react-datepicker.css'
import config from '../config'

const initialState = {
  title: '',
  content: '',
  deadline: null,
  priority: 0,
  status: 0
}

class Write extends React.Component {
  constructor(props) {
    super(props)

    const { item } = this.props

    this.state =
      item ?
      {
        _id: item._id,
        title: item.title,
        content: item.content,
        deadline: item.deadline ? moment(item.deadline) : null,
        priority: item.priority,
        status: item.status
      }
      :
      initialState

    this.handleInput = this.handleInput.bind(this)
  }

  componentDidMount() {
    const { M } = window

    M.FormSelect.init(document.querySelectorAll('select'))
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handlePick(date) {
    this.setState({ deadline: date })
  }

  handleRating(rate) {
    this.setState({ priority: rate })
  }

  handleSubmit() {
    const { M } = window
    const { state } = this

    if (state.deadline) state.deadline = moment(state.deadline).toDate()

    if (!this.props.item) {
      axios.post(`${config.api}/item`, state)
      .then(response => {
        M.toast({ html: '등록되었습니다.' })
        this.setState(initialState, () => this.props.close())
      })
      .catch(error => {
        M.toast({ html: '에러가 발생했습니다.' })
        console.error(error)
      })
    } else {
      axios.put(`${config.api}/item`, state)
      .then(response => {
        M.toast({ html: '수정되었습니다.' })
        this.setState(initialState, () => this.props.close())
      })
      .catch(error => {
        M.toast({ html: '에러가 발생했습니다.' })
        console.error(error)
      })
    }
  }

  render() {
    return (
      <div className="row">
        <div className="input-field s12">
          <select name="status" value={this.state.status} onChange={this.handleInput}>
            <option value={0}>To Do</option>
            <option value={1}>Doing</option>
            <option value={2}>Done</option>
          </select>
        </div>
        <div className="input-field s12">
          <input type="text" name="title" value={this.state.title} onChange={this.handleInput} />
          <label htmlFor="title">제목</label>
        </div>
        <div className="input-field s12">
          <textarea className="materialize-textarea" name="content" value={this.state.content} onChange={this.handleInput} />
          <label htmlFor="content">내용</label>
        </div>
        <div className="input-field s12">
          <ReactDatepicker
            placeholderText="마감기한"
            selected={this.state.deadline}
            onChange={this.handlePick.bind(this)} />
        </div>
        <label>중요도</label>
        <ReactStars
          half={false}
          size={30}
          value={this.state.priority}
          onChange={this.handleRating.bind(this)} />
        <div className="center-align">
          <button className="btn waves-effect waves-light" disabled={!this.state.title} onClick={this.handleSubmit.bind(this)}>
            { !this.props.item ? '추가' : '수정'}
            <i className="material-icons right">send</i>
          </button>
        </div>
      </div>
    )
  }
}

export default Write
