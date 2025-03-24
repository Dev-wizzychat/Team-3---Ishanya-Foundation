import React, { Component } from "react";

export class Animations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      i: 0,
      messageIndex: 0,
    };
    this.messages = [
      "Welcome to Ishanya Foundation!",
      "Empowering stakeholders through capacity-building initiatives for sustainable impact.",
      "Creating inclusive spaces that foster learning, growth, and accessibility.",
      "Advocating for policy changes to ensure social, economic, and political inclusion.",
      "Transforming persons with disabilities from beneficiaries to active contributors in society.",
      "Driving innovation through person-centric solutions that address real challenges.",
    ]; // Array of messages
    this.speed = 50; // Typing speed in milliseconds
  }

  componentDidMount() {
    this.typeWriter(); // Start animation when component mounts
  }

  typeWriter = () => {
    const currentMessage = this.messages[this.state.messageIndex];

    if (this.state.i < currentMessage.length) {
      this.setState(
        (prevState) => ({
          text: prevState.text + currentMessage.charAt(prevState.i),
          i: prevState.i + 1,
        }),
        () => {
          setTimeout(this.typeWriter, this.speed);
        }
      );
    } else {
      // Wait 1 second, then reset and switch to the next message
      setTimeout(() => {
        this.setState(
          (prevState) => ({
            text: "",
            i: 0,
            messageIndex: (prevState.messageIndex + 1) % this.messages.length, // Loop through messages
          }),
          this.typeWriter
        );
      }, 1000);
    }
  };
  render() {
    return (
      <>
        <h1>Typewriter Effect</h1>
        <p>{this.state.text}</p>
      </>
    );
  }
}

export default Animations;
