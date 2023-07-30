import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePageTitle } from "../../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEdit, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { BUTTON_STATE, debounce } from "../../utils";
import { createAccount, deleteAnAccount, getAccountsList, updateAccount } from "../../api";
import { ButtonSubmit, EmailField, NameField, Pagination, PasswordField } from "../../components";
import { Modal } from "react-bootstrap";

const Account = ({ pageTitle }) => {
  usePageTitle(pageTitle);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    limit: 12,
    currentPage: 1,
    totalPages: 1,
  })
  const [accountsList, setAccountsList] = useState([])
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  const [showUpdateAccountModal, setShowUpdateAccountModal] = useState(false)
  const [accountUpdate, setAccountUpdate] = useState()
  const [checkboxState, setCheckboxState] = useState(false)
  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE);

  const fetchData = async (limit, page) => {
    if (page && page !== pagination.currentPage) setPagination({ ...pagination, currentPage: page })
    if (limit && limit !== pagination.limit) setPagination({ ...pagination, limit })

    const response = await getAccountsList(undefined, limit || undefined, page || undefined);
    if (response?.status === 200) {
      setAccountsList(response.data.data.data);
      setPagination({
        ...pagination,
        limit: response.data.data.limit,
        currentPage: response.data.data.currentPage,
        totalPages: response.data.data.totalPages,
      })
    }
  }

  useEffect(() => {
    debounce('accountsList', fetchData(searchParams.get('limit'), searchParams.get('page')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleLimitChange = event => {
    const limit = event.target.value
    if (!isNaN(limit)) setPagination({ ...pagination, limit })
  }

  const handleSubmitLimit = event => {
    event.preventDefault()
    setSearchParams({ limit: event.currentTarget.limit.value })
  }

  // all value must true to submit form
  const validationObject = useRef({
    name: false,
    email: false,
    password: false,
  });

  const handleValidate = (key, value) => {
    validationObject.current[key] = value;
  };

  // all value must true to submit form
  const validationUpdateObject = useRef({
    name: true,
    emailUpdate: true,
    passwordUpdate: true,
  });

  const handleUpdateValidate = (key, value) => {
    validationUpdateObject.current[key] = value;
  };


  const closeAddAccountModal = () => {
    setShowAddAccountModal(false)
    validationObject.current = {
      name: false,
      email: false,
      password: false,
    }
    setButtonState(BUTTON_STATE.ENABLE)
    setCheckboxState(false)
  }

  const closeUpdateAccountModal = () => {
    setShowUpdateAccountModal(false)
    validationUpdateObject.current = {
      name: true,
      emailUpdate: true,
      passwordUpdate: true,
    }
    setButtonState(BUTTON_STATE.ENABLE)
    setCheckboxState(false)
  }

  const handleAddAccount = async formBody => {
    try {
      setButtonState(BUTTON_STATE.PENDING);
      const responseAddAccount = await createAccount(formBody);
      if (responseAddAccount.status === 201) {
        closeAddAccountModal()
        fetchData(searchParams.get('limit'), searchParams.get('page'))
      } else {
        setButtonState(BUTTON_STATE.ERROR);
      }
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.ERROR);
    }
  };

  const handleUpdateAccount = async (id, formBody) => {
    try {
      setButtonState(BUTTON_STATE.PENDING);
      const responseAddAccount = await updateAccount(id, formBody);
      if (responseAddAccount.status === 200) {
        closeUpdateAccountModal()
        fetchData(searchParams.get('limit'), searchParams.get('page'))
      } else {
        setButtonState(BUTTON_STATE.ERROR);
      }
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.ERROR);
    }
  };

  const handleSubmitAddAccount = event => {
    event.preventDefault();
    // check the isValid Object is NOT has any fields not valid
    if (!Object.values(validationObject.current).includes(false)) {
      const { currentTarget } = event;
      const formBody = {
        name: currentTarget.name.value,
        email: currentTarget.email.value,
        password: currentTarget.password.value,
        roles: checkboxState ? ['user', 'admin'] : ['user']
      };
      handleAddAccount(formBody);
    }
  };

  const handleSubmitUpdateAccount = event => {
    event.preventDefault();
    // check the isValid Object is NOT has any fields not valid
    if (!Object.values(validationUpdateObject.current).includes(false)) {
      const { currentTarget } = event;
      const formBody = {
        name: currentTarget.name.value,
        email: currentTarget.emailUpdate.value,
        password: currentTarget.passwordUpdate.value,
        roles: checkboxState ? ['user', 'admin'] : ['user']
      };
      if (!formBody.password) delete formBody.password
      handleUpdateAccount(currentTarget.id.value, formBody);
    }
  };

  const handleDeleteAccount = async accountId => {
    try {
      const responseDeleteAccount = await deleteAnAccount(accountId);
      if (responseDeleteAccount.status === 200) {
        closeAddAccountModal()
        fetchData(searchParams.get('limit'), searchParams.get('page'))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const setPage = page => {
    const limit = searchParams.get('limit')
    if (limit) setSearchParams({ limit, page })
    else setSearchParams({ page })
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-auto fs-1">
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="btn btn-lg btn-outline-secondary"
            onClick={() => navigate('/', { replace: true })}
          />
        </div>
        <div className="col">
          <h1 className="h1 text-orange my-2">
            <strong>
              Accounts
            </strong>
          </h1>
        </div>
      </div>

      <div className="row mt-2 mx-0 rounded rounded-sm p-3 bg-white shadow-sm">
        <div className="row px-0 mx-0">
          <div className="col text-end">
            <div className="btn btn-orange text-light" onClick={() => setShowAddAccountModal(true)}>
              <FontAwesomeIcon icon={faPlus} className="me-1 text-light" /> Add account
            </div>
            <Modal
              show={showAddAccountModal}
              onHide={closeAddAccountModal}
              backdrop={true}
              size="lg"
              aria-labelledby="contained-modal"
              centered
              dialogClassName="maxWidth-674px"
            >
              <form onSubmit={handleSubmitAddAccount}>
                <Modal.Header closeButton>
                  <Modal.Title>Add account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <NameField
                    isDisabled={(buttonState === BUTTON_STATE.PENDING)}
                    handleValidate={handleValidate}
                    placeholder=""
                  />
                  <EmailField
                    isDisabled={(buttonState === BUTTON_STATE.PENDING)}
                    handleValidate={handleValidate}
                    placeholder=""
                  />
                  <PasswordField
                    isDisabled={(buttonState === BUTTON_STATE.PENDING)}
                    handleValidate={handleValidate}
                    placeholder=""
                  />
                  <div className="form-check form-switch">
                    <input
                      className="form-control form-check-input form-check-input-orange"
                      type="checkbox"
                      id="isAdminAdd"
                      name="isAdmin"
                      onChange={() => setCheckboxState(!checkboxState)}
                    />
                    <label className="form-check-label" htmlFor="isAdminAdd">Admin role</label>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <div className="btn btn-outline-orange w-25" onClick={closeAddAccountModal}>
                    Cancel
                  </div>
                  <ButtonSubmit
                    buttonState={buttonState}
                    resetState={() => setButtonState(BUTTON_STATE.ENABLE)}
                    className="btn btn-orange text-light w-25"
                    title="Add"
                  />
                </Modal.Footer>
              </form>
            </Modal>
          </div>
        </div>

        <div className="row px-0 mx-0">
          <div className="col-12 p-0" style={{ overflowX: 'auto' }}>
            <table className="table table-hover my-3">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-third">Created at</th>
                  <th scope="col" className="text-third">Name</th>
                  <th scope="col" className="text-third">Email</th>
                  <th scope="col" className="text-third">Roles</th>
                  <th scope="col" className="text-third text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {accountsList?.map(account => (
                  <tr key={account._id}>
                    <td>{new Date(account.createdAt).toLocaleString()}</td>
                    <td>{account.name}</td>
                    <td>{account.email}</td>
                    <td>{account.roles.join(', ')}</td>
                    <td>
                      <div className="row mx-0 text-center">
                        <div className="col cursor-pointer px-0">
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-orange"
                            ize="lg"
                            onClick={() => {
                              setAccountUpdate(account)
                              setCheckboxState(account.roles.includes('admin'))
                              setShowUpdateAccountModal(true)
                            }}
                          />
                        </div>
                        <div className="col cursor-pointer px-0">
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="text-secondary"
                            size="lg"
                            onClick={() => handleDeleteAccount(account._id)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                <Modal
                  show={showUpdateAccountModal}
                  onHide={closeUpdateAccountModal}
                  backdrop={true}
                  size="lg"
                  aria-labelledby="contained-modal"
                  centered
                  dialogClassName="maxWidth-674px"
                >
                  <form onSubmit={handleSubmitUpdateAccount}>
                    <Modal.Header closeButton>
                      <Modal.Title>Update account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <input
                        hidden
                        type="text"
                        name="id"
                        value={accountUpdate?._id}
                        readOnly
                      />
                      <NameField
                        isDisabled={(buttonState === BUTTON_STATE.PENDING)}
                        handleValidate={handleUpdateValidate}
                        placeholder=""
                        defaultValue={accountUpdate?.name}
                      />
                      <EmailField
                        fieldName="emailUpdate"
                        isDisabled={(buttonState === BUTTON_STATE.PENDING)}
                        handleValidate={handleUpdateValidate}
                        placeholder=""
                        defaultValue={accountUpdate?.email}
                      />
                      <PasswordField
                        fieldName="passwordUpdate"
                        isDisabled={(buttonState === BUTTON_STATE.PENDING)}
                        handleValidate={handleUpdateValidate}
                        placeholder=""
                        defaultValue=""
                        isRequired={false}
                        defaultIsShowPassword={true}
                      />
                      <div className="form-check form-switch">
                        <input
                          className="form-control form-check-input form-check-input-orange"
                          type="checkbox"
                          name="isAdmin"
                          checked={checkboxState}
                          onChange={() => setCheckboxState(!checkboxState)}
                        />
                        <label className="form-check-label">Admin role</label>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <div className="btn btn-outline-orange w-25" onClick={closeUpdateAccountModal}>
                        Cancel
                      </div>
                      <ButtonSubmit
                        buttonState={buttonState}
                        resetState={() => setButtonState(BUTTON_STATE.ENABLE)}
                        className="btn btn-orange text-light w-25"
                        title="Update"
                      />
                    </Modal.Footer>
                  </form>
                </Modal>
              </tbody>
            </table>
          </div>
        </div>

        <div className="row px-0 mx-0 text-third">
          <div className="col-md-6 col-lg p-1">
            <form onSubmit={handleSubmitLimit}>
              Rows per page:
              <input
                name="limit"
                id="limit"
                type="number"
                value={pagination.limit}
                onChange={handleLimitChange}
                min={1} max={100}
                className="input-transparent ms-2"
                style={{ width: '42px' }}
              />

              {
                // eslint-disable-next-line eqeqeq
                ((!searchParams.get('limit') && pagination.limit != 12) ||
                  (searchParams.get('limit') && pagination.limit !== searchParams.get('limit')))
                && <button className="btn btn-sm btn-light" type="submit">
                  Set
                </button>
              }
            </form>
          </div>
          <div className="col">
            <Pagination currentPage={Number(pagination.currentPage)} totalPages={Number(pagination.totalPages)} handlePageChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  Account
}
