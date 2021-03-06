import React from 'react'
import axios from 'axios'
import {me} from '../store/user'
import {getInitialSinglePet, editPet} from '../store/petSelector'
import {getMyChores} from '../store/myChores'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'


class MyPet extends React.Component {
  constructor() {
    super()
    this.state = {
      name: "",
      redirect: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setRedirect = this.setRedirect.bind(this)
    this.renderRedirect = this.renderRedirect.bind(this)
  }

  setRedirect() {
    this.setState({
      redirect: true
    })
  }
  renderRedirect() {
    if (this.state.redirect) {
      return <Redirect to='/mychores' />
    }
  }

  componentDidMount(){
    //get petId from url
    this.props.getSinglePet(this.props.match.params.petId)

  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value })
  }

  async handleSubmit(evt) {
    evt.preventDefault()
    //we want to update the user instead with the this.state.name and the image
    //if this.props.match.params.1 === bunny, else === cat
    //get rid of this line:
    // this.props.updatePet({name: this.state.name, userId: this.props.user.id, used: true}, this.props.pet.id)
    try {
      if (this.props.match.params.petId === 1){
        await axios.put(`/api/users/${this.props.user.id}`, {familyIdFinal: true, petName: this.state.name, petImage: "https://chore-bunny.herokuapp.com/bunny.png", happyPetImage: "https://chore-bunny.herokuapp.com/happyBunny.gif"})
      } else {
        await axios.put(`/api/users/${this.props.user.id}`, {familyIdFinal: true, petName: this.state.name, petImage: "https://chore-bunny.herokuapp.com/cat.png", happyPetImage: "https://chore-bunny.herokuapp.com/happyCat.gif"})
      }

      this.props.getChores(this.props.user.id)
      this.setRedirect()
      window.location.reload()
    }catch (error){
         console.log(error)
       }

  }

  render(){
    console.log("MYPET", this.props)
    console.log("MYPETNAME", this.state.name)
    return (
      <div>
                      {this.renderRedirect()}

        Here's your pet.  Let's give him/her a name!
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" />
            <input
              type="text"
              name="name"
              onChange={this.handleChange}
              value={this.state.name}
              placeholder="Your Pet's Name"
            />
             <button
            disabled={
              !this.state.name
            }
              className="btn btn-secondary col md-4 center-blocks"
              type="submit"
              onClick={this.submit}
            >
              Submit
            </button>
          </div>
        </form>
        {
          (this.props.match.params.petId === 1) ?
            <img src="https://chore-bunny.herokuapp.com/bunny.png" /> :
            <img src="https://chore-bunny.herokuapp.com/cat.png" />
        }

      </div>
    )
  }


}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    pet: state.petSelector.singlePet,
    chores: state.myChores.chores
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    findUser: () => dispatch(me()),
    getSinglePet: (id) => dispatch(getInitialSinglePet(id)),
    updatePet: (pet, petId) => dispatch(editPet(pet, petId)),
    getChores: (id) => dispatch(getMyChores(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPet)
