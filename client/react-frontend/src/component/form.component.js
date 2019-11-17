import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAnalysedData } from "../service/apiCall";
import Collapsible from "react-collapsible";
import _ from "lodash";

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
      loading: false,
      analysedData: null
    };
  }

  toastError = msg => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  toastSuccess = msg => {
    toast.success(msg, {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

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
    const that = this;
    e.preventDefault();
    await this.checkValidation();
    if (await formValid(this.state)) {
      // check if any value is blank or invalid
      this.setState({ loading: true, analysedData: null });
      getAnalysedData(this.state.url)
        .then(function(response) {
          console.log("response", response);
          if (response) {
            that.setState({ loading: false });
            that.toastSuccess("Analysed URL successfully");
            that.setState({ analysedData: response });
          }
        })
        .catch(function(error) {
          console.log(error);
          if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            that.toastError(error.response.data.message);
          } else {
            that.toastError("Something went wrong");
          }
          that.setState({ loading: false });
        });
    } else {
      // alert("Form is invalid!");
      this.toastError("Form is invalid!");
      this.setState({ loading: false });
    }
  };

  componentDidUpdate() {
    // if(this.state.loading === true) {
    //   setTimeout(() => {
    //       this.setState({loading: false});
    //     }, 2000);
    // }
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
      <>
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
          <button
            disabled={this.state.loading}
            type="submit"
            className="btn btn-block btn-danger"
          >
            {this.state.loading ? (
              <>
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Analysing Webpage please wait...
              </>
            ) : (
              <>Analyse</>
            )}
          </button>
          {}
        </form>

        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />

        {this.state.analysedData && (
          <>
            {console.log(this.state.analysedData)}
            {console.log(typeof this.state.analysedData)}
            {console.log(
              _.get(this.state.analysedData, "title", "No data Found")
            )}

            <Collapsible trigger="HTML">
              <p>
                {_.get(this.state.analysedData, "data.html", "No data Found")}
              </p>
            </Collapsible>

            <Collapsible trigger="Title">
              <p>
                {_.get(this.state.analysedData, "data.title", "No data Found")}
              </p>
            </Collapsible>

            <Collapsible trigger="Headings">
              <h3>
                Total Heading tags:{" "}
                {_.get(
                  this.state.analysedData,
                  "data.numberOfHeadings",
                  "No data Found"
                )}
              </h3>
              <p></p>
              <p>
                {" "}
                Number of h1 tags:{" "}
                {_.get(
                  this.state.analysedData,
                  "data.h1",
                  "No data Found"
                )}{" "}
              </p>
              <p>
                {" "}
                Number of h2 tags:{" "}
                {_.get(
                  this.state.analysedData,
                  "data.h2",
                  "No data Found"
                )}{" "}
              </p>
              <p>
                {" "}
                Number of h3 tags:{" "}
                {_.get(
                  this.state.analysedData,
                  "data.h3",
                  "No data Found"
                )}{" "}
              </p>
              <p>
                {" "}
                Number of h4 tags:{" "}
                {_.get(
                  this.state.analysedData,
                  "data.h4",
                  "No data Found"
                )}{" "}
              </p>
              <p>
                {" "}
                Number of h5 tags:{" "}
                {_.get(
                  this.state.analysedData,
                  "data.h5",
                  "No data Found"
                )}{" "}
              </p>
              <p>
                {" "}
                Number of h6 tags:{" "}
                {_.get(
                  this.state.analysedData,
                  "data.h6",
                  "No data Found"
                )}{" "}
              </p>
            </Collapsible>

            <Collapsible trigger="Internal links">
              <h3>
                Total Internal links:{" "}
                {_.get(this.state.analysedData, "data.internalinks", []).length}
              </h3>
              <p></p>
              {_.get(this.state.analysedData, "data.internalinks", false) &&
                _.get(this.state.analysedData, "data.internalinks", []).map(
                  (value, id) => (
                    <p key={`interlink_${id}`}>
                      Link {id + 1}: {value.link}{" "}
                    </p>
                  )
                )}
            </Collapsible>

            <Collapsible trigger="External links">
              <h3>
                Total External links:{" "}
                {_.get(this.state.analysedData, "data.externalLinks", []).length}
              </h3>
              <p></p>
              {_.get(this.state.analysedData, "data.externalLinks", false) &&
                _.get(this.state.analysedData, "data.externalLinks", []).map(
                  (value, id) => (
                    <p key={`externallink_${id}`}>
                      Link {id + 1}: {value.link}{" "}
                    </p>
                  )
                )}
            </Collapsible>
            <Collapsible trigger="Loading time">
              <h3>
              Loading time of analysed webpage:{" "}
                {_.get(this.state.analysedData, "data.responseTime", [])} ms
              </h3>
              {/* <p></p>
              {_.get(this.state.analysedData, "data.externalLinks", false) &&
                _.get(this.state.analysedData, "data.externalLinks", []).map(
                  (value, id) => (
                    <p key={`externallink_${id}`}>
                      Link {id + 1}: {value.link}{" "}
                    </p>
                  )
                )} */}
            </Collapsible>
          </>
        )}
      </>
    );
  }
}
