import React, { Component } from "react";

const regExp = RegExp(
  /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
);

const formValid = ({ isError, ...rest }) => {
  let isValid = false;

  Object.values(isError).forEach(val => {
    if (val.length > 0) {
      isValid = false;
    } else {
      isValid = true;
    }
  });

  return isValid;
};

export default class UserForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      isError: {
        url: ""
      },
      fields: ["url"],
      loading: false
    };
  }

  checkValidation = () => {
    const { fields } = this.state;
    let isError = { ...this.state.isError };

    fields.forEach(element => {
      let value = this.state[element];
      switch (element) {
        case "url":
          isError[element] = regExp.test(value) ? "" : "URL is invalid";
          isError[element] =
            value.length <= 0 ? "Url is required" : isError[element];
          break;
        default:
          break;
      }
    });

    this.setState(
      {
        isError
      },
      () => {
        return true;
      }
    );
    return false;
  };

  onSubmit = async e => {
    e.preventDefault();
    await this.checkValidation();
    if (await formValid(this.state)) {
      // check if any value is blank or invalid
      this.setState({loading: true}, () => {
      });
    } else {
      alert("Form is invalid!");
    }
  };

  componentDidUpdate() {
      if(this.state.loading === true) {
        setTimeout(() => {
            this.setState({loading: false});
          }, 2000);
      }
  }

  formValChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let isError = { ...this.state.isError };

    switch (name) {
      case "url":
        isError.url = value.length <= 0 ? "Url is required" : "";
        isError.url = regExp.test(value) ? "" : "URL is invalid";
        break;
      default:
        break;
    }

    this.setState({
      isError,
      [name]: value
    });
  };

  render() {
    const { isError } = this.state;

    return (
      <form onSubmit={this.onSubmit} noValidate>
        <div className="form-group">
          <label>Enter URL</label>
          <input
            type="text"
            className={
              isError.url.length > 0
                ? "is-invalid form-control"
                : "form-control"
            }
            name="url"
            onChange={this.formValChange}
          />
          {isError.url.length > 0 && (
            <span className="invalid-feedback">{isError.url}</span>
          )}
        </div>
        <button disabled={this.state.loading} type="submit" className="btn btn-block btn-danger">
          {this.state.loading ?<>
            <span
              className="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Analysing Webpage please wait...
          </> :
          <>
            Analyse
          </>}
        </button>
      </form>
    );
  }
}
