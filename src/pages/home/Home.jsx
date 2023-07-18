import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks";
import { useAccount } from "../../contexts";
import { ROUTERS_PATH, toNavigatePath } from "../../routers/MainRoutes";
import AccountBasicInfo from "./components/AccountBasicInfo";
import { debounce } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

const Home = ({ pageTitle }) => {
  usePageTitle(pageTitle);
  const navigate = useNavigate();
  const accountContext = useAccount();

  return (
    <div className="container py-5">
      <div className="row m-0 p-2 p-sm-3 p-md-1">
        <div className="col-12 col-lg-6 col-xxl-4 text-center p-0 me-0 me-md-2 mb-2 mb-md-0">
          <div className="rounded rounded-sm bg-white py-3">
            <AccountBasicInfo />
          </div>
        </div>

        <div className="col p-3 rounded rounded-sm bg-white">
          <div className="row text-center">
            <h2><strong>
              System management
            </strong></h2>
          </div>
          <div className="row p-3">
            <div
              className="btn btn-lg btn-orange text-light"
              onClick={() => navigate(toNavigatePath(ROUTERS_PATH.accounts))}
            >
              <div className="row">
                <div className="col-10 text-start">
                  <FontAwesomeIcon icon={faUserEdit} className="pe-2" />
                  Accounts
                </div>
                <div className=" col-2 text-end">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              </div>
            </div>
          </div>
          <div className="row p-3">
            <div
              className="btn btn-lg btn-orange text-light"
              onClick={() => navigate(toNavigatePath(ROUTERS_PATH.miniTests))}
            >
              <div className="row">
                <div className="col-10 text-start">
                  <FontAwesomeIcon icon={faListCheck} className="pe-2" />
                  Mini tests
                </div>
                <div className="col-2 text-end">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              </div>
            </div>
          </div>
          <div className="row p-3">
            <div
              className="btn btn-lg btn-orange text-light"
              onClick={() => navigate(toNavigatePath(ROUTERS_PATH.speedTests))}
            >
              <div className="row">
                <div className="col-10 text-start">
                  <FontAwesomeIcon icon={faClockRotateLeft} className="pe-2" />
                  Speed tests
                </div>
                <div className="col-2 text-end">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              </div>
            </div>
          </div>
          <div className="row p-3">
            <div
              className="btn btn-lg btn-orange text-light"
              onClick={() => navigate(toNavigatePath(ROUTERS_PATH.readingTips))}
            >
              <div className="row">
                <div className="col-10 text-start">
                  <FontAwesomeIcon icon={faLightbulb} className="pe-2" />
                  Reading tips
                </div>
                <div className="col-2 text-end">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  Home
}
