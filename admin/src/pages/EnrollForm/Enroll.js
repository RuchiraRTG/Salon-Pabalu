import React from "react";
import "../EnrollForm/Enroll.css";

function Enroll() {
  return (
    <div className="mainPagecontainer">
      <div className="enroll-form-container">
        <h2 className="enrollnowH2">Enroll Now</h2>

        <form clsaaName="userDetailsForm">
          <fieldset>
            <legend>User Details:</legend>
            <table>
              <tr>
                <td>
                  <label ClassName="Enroll-form-label" for="name">
                    Full Name
                  </label>
                </td>
                <td>
                  <input className="Enroll-form-input" type="text" id="name" />
                </td>
              </tr>
              <tr>
                <td>
                  <label ClassName="Enroll-form-label" for="email">
                    Email
                  </label>
                </td>
                <td>
                  <input
                    className="Enroll-form-input"
                    type="email"
                    id="email"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label ClassName="Enroll-form-label" for="telnum">
                    Mobile Number
                  </label>
                </td>
                <td>
                  <input
                    className="Enroll-form-input"
                    type="telnum"
                    id="telnum"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label ClassName="Enroll-form-label" for="Roll No.">
                    NIC Number
                  </label>
                </td>
                <td>
                  <input className="Enroll-form-input" type="text" id="nic" />
                </td>
              </tr>
            </table>
          </fieldset>
        </form>
        <br />

        <form clsaaName="coursDetailsForm">
          <fieldset>
            <legend>Enroll Details</legend>

            <table>
              <tr>
                <td>
                  <label ClassName="Enroll-form-label" for="name">
                    Trainee Id
                  </label>
                </td>
                <td>
                  <input
                    className="Enroll-form-input"
                    type="text"
                    id="name"
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label ClassName="Enroll-form-label" for="Courses">
                    Choose The Course
                  </label>
                </td>
                <td>
                  <select className="Enroll-form-select" id="cars" name="cars">
                    <option className="enrollFormOptions" value="0">
                      Select The Course
                    </option>
                    <option value="1">Basic Haircutting</option>
                    <option value="2">Advanced Haircutting</option>
                    <option value="3">Hair Coloring Techniques</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td>
                  <label ClassName="Enroll-form-label" for="Courses">
                    Session Time
                  </label>
                </td>
                <td>
                  <select className="Enroll-form-select" id="cars" name="cars">
                    <option value="0">Select week end or week day</option>
                    <option value="1">Week Day</option>
                    <option value="2">Week End</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label ClassName="Enroll-form-label" for="name">
                    Location
                  </label>
                </td>
                <td>
                  <input
                    type="radio"
                    id="Location-mahiyangana"
                    name="question"
                    className="locationRadio"
                  />
                  <label for="">Mahiyanganaya</label> <br />
                  <input
                    type="radio"
                    id="Location-Bibile"
                    name="question"
                    className="locationRadio"
                  />
                  <label for="">Bibile</label>
                </td>
              </tr>
            </table>
          </fieldset>
        </form>

        <div>
          <button className="enroll-button" type="submit" value="submit">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}
export default Enroll;
