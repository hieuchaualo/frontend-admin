import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../../..//contexts";
import { loginAccount } from "../../../api";
import { ROUTERS_PATH, toNavigatePath } from "../../../routers/MainRoutes";
import { ACCOUNT_ROLES, BUTTON_STATE } from "../../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

const quizInit = {
  question: '',
  options: [],
  answers: [''],
}

const Editor = () => {
  const navigate = useNavigate();
  const accountContext = useAccount();
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [quizzes, setQuizzes] = useState([quizInit])
  const [thumbnail, setThumbnail] = useState(undefined);
  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE);


  const handleTitleChange = event => {
    setTitle(event.target.value)
  }

  const handleContentChange = event => {
    setContent(event.target.value)
  }

  const pushQuiz = () => {
    const newQuizzes = [...quizzes, quizInit]
    setQuizzes(newQuizzes)
  }

  const popQuiz = () => {
    setQuizzes(currentQuizzes => currentQuizzes.filter((_, index) => index !== quizzes.length - 1))
  }

  const pushOption = quizIndex => {
    const newOptions = [...quizzes[quizIndex].options, '']
    setQuizzes(currentQuizzes => currentQuizzes.map((quiz, index) => (index === quizIndex) ? { ...quiz, options: newOptions } : quiz))
  }

  const popOption = quizIndex => {
    const newOptions = quizzes[quizIndex].options.filter((_, index) => index !== quizzes[quizIndex].options.length - 1)
    setQuizzes(currentQuizzes => currentQuizzes.map((quiz, index) => (index === quizIndex) ? { ...quiz, options: newOptions } : quiz))
  }

  const handleOptionChange = (quizIndex, optionIndex, value) => {
    const newOptions = quizzes[quizIndex].options.map((option, index) => index === optionIndex ? value : option)
    setQuizzes(currentQuizzes => currentQuizzes.map((quiz, index) => (index === quizIndex) ? { ...quiz, options: newOptions } : quiz))
  }

  const pushAnswer = quizIndex => {
    const newOptions = [...quizzes[quizIndex].answers, '']
    setQuizzes(currentQuizzes => currentQuizzes.map((quiz, index) => (index === quizIndex) ? { ...quiz, answers: newOptions } : quiz))
  }

  const popAnswer = quizIndex => {
    const newAnswer = quizzes[quizIndex].answers.filter((_, index) => index !== quizzes[quizIndex].answers.length - 1)
    setQuizzes(currentQuizzes => currentQuizzes.map((quiz, index) => (index === quizIndex) ? { ...quiz, answers: newAnswer } : quiz))
  }

  const handleAnswerChange = (quizIndex, optionIndex, value) => {
    const newAnswer = quizzes[quizIndex].answers.map((option, index) => index === optionIndex ? value : option)
    setQuizzes(currentQuizzes => currentQuizzes.map((quiz, index) => (index === quizIndex) ? { ...quiz, answers: newAnswer } : quiz))
  }

  const handleQuestionChange = (quizIndex, value) => {
    setQuizzes(currentQuizzes => currentQuizzes.map((quiz, index) => (index === quizIndex) ? { ...quiz, question: value } : quiz))
  }

  const handleThumbnailChange = event => {
    if (event.target.files[0]
      && (event.target.files[0].type === 'image/jpeg'
        || event.target.files[0].type === 'image/jpg'
        || event.target.files[0].type === 'image/png')
    ) return setThumbnail(event.target.files[0])
    else {
      setThumbnail(undefined)
      document.getElementById('thumbnail').value = null
      window.scroll(0, document.getElementById('thumbnail'))
    }
  }

  // all value must true to submit form
  const validationObject = useRef({
    title: false,
    content: false,
    quizzes: false,
    options: false,
    thumbnail: false,
  });

  const handleOnChange = (key, value) => {
    validationObject.current[key] = value;
  };

  const handleLogin = async formBody => {
    try {
      setButtonState(BUTTON_STATE.PENDING);
      const response = await loginAccount(formBody);
      if (response.data?.token && response.data?.account?.roles.includes(ACCOUNT_ROLES.ADMIN)) {
        localStorage.setItem('jwt_token', response.data.token);
        accountContext.init(response.data.account);
        setButtonState(BUTTON_STATE.SUCCESS);
        navigate(toNavigatePath(ROUTERS_PATH.home));
      } else {
        setButtonState(BUTTON_STATE.ERROR);
      }
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.ERROR);
    }
  };

  const handleOnSubmit = event => {
    event.preventDefault();
    console.log({ title, content, quizzes, thumbnail })
    // check the isValid Object is NOT has any fields not valid
    if (!Object.values(validationObject.current).includes(false)) {
      const { currentTarget } = event;
      const formBody = {
        email: currentTarget.email.value,
        password: currentTarget.password.value,
      };
      handleLogin(formBody);
    }
  };

  return (
    <form onSubmit={handleOnSubmit} >
      <div className="row text-orange">
        <h2>
          <FontAwesomeIcon icon={faEdit} /> <strong>Create new</strong>
        </h2>
      </div>
      <div style={{ height: '50vh', overflowY: 'scroll' }} className="border rounded rounded-sm p-3">
        <div className="form-group my-2">
          <label htmlFor='thumbnail'>
            Thumbnail <span className="text-danger">*</span>
          </label>
          <input
            name='thumbnail'
            id='thumbnail'
            type="file"
            className={`form-control my-1`}
            onChange={handleThumbnailChange}
            accept='image/png, image/jpg, image/jpeg'
            required
          />
          <small className='text-muted'>
            File types supported: PNG, JPG, JPEG. Max size: 1MB
          </small>
        </div>

        <div className="form-group my-2">
          <label htmlFor='title'>
            Title <span className="text-danger">*</span>
          </label>
          <input
            name='title'
            id='title'
            type="text"
            className={`form-control my-1`}
            autoComplete="off"
            value={title}
            onChange={handleTitleChange}
            maxLength={512}
            required
          />
        </div>

        <div className="form-group my-2">
          <label htmlFor='content'>
            Content <span className="text-danger">*</span>
          </label>
          <textarea
            name='content'
            id='content'
            type="text"
            className={`form-control my-1`}
            autoComplete="off"
            value={content}
            onChange={handleContentChange}
            required
          />
        </div>

        <div className="mt-3 fs-5 text-center">Quizzes: {quizzes.length}</div>

        <div className="">
          <hr className="hr" />
          <div className='btn btn-sm btn-outline-primary' onClick={pushQuiz}>
            <FontAwesomeIcon icon={faPlus} className='me-2' />
            Add quiz
          </div>

          <div className={`btn btn-sm btn-sm btn-outline-secondary ${quizzes.length === 1 && 'disabled'} ms-2`} onClick={popQuiz}>
            <FontAwesomeIcon icon={faXmark} className='me-2' />
            Remove quiz
          </div>

          {quizzes.map((quiz, quizIndex) => (
            <div key={quizIndex}>
              <hr className="hr" />
              <div className="my-2 fw-bold">Quiz {quizIndex + 1}</div>
              <div className="form-group my-2">
                <label htmlFor='content'>
                  Question <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={1}
                  name='content'
                  id='content'
                  type="text"
                  className={`form-control my-1`}
                  autoComplete="off"
                  value={quiz.question}
                  onChange={event => handleQuestionChange(quizIndex, event.target.value)}
                  required />
              </div>

              <div className="form-group my-2">
                <label htmlFor='option'>
                  Options: {quiz.options.length}
                </label>
                <br />

                <div className='btn btn-sm btn-outline-primary' onClick={() => pushOption(quizIndex)}>
                  <FontAwesomeIcon icon={faPlus} className='me-2' />
                  Add option
                </div>

                <div
                  className={`btn btn-sm btn-outline-secondary ${quiz.options.length === 0 && 'disabled'} ms-2`}
                  onClick={() => popOption(quizIndex)}
                >
                  <FontAwesomeIcon icon={faXmark} className='me-2' />
                  Remove option
                </div>

                {quiz.options.map((option, optionIndex) => <div key={optionIndex} className="row mx-0">
                  <div className="col-auto">{optionIndex + 1}. </div>
                  <input
                    name='option'
                    type="text"
                    className={`col form-control form-control-sm my-1`}
                    autoComplete="off"
                    value={option}
                    onChange={event => handleOptionChange(quizIndex, optionIndex, event.target.value)}
                    required
                  />
                </div>)}
              </div>

              <div className="form-group my-2">
                <label htmlFor='option'>
                  Answers: {quiz.answers.length}  <span className="text-danger">*</span>
                </label>
                <br />

                <div className='btn btn-sm btn-outline-primary' onClick={() => pushAnswer(quizIndex)}>
                  <FontAwesomeIcon icon={faPlus} className='me-2' />
                  Add answer
                </div>

                <div
                  className={`btn btn-sm btn-outline-secondary ${quiz.answers.length === 1 && 'disabled'} ms-2`}
                  onClick={() => popAnswer(quizIndex)}
                >
                  <FontAwesomeIcon icon={faXmark} className='me-2' />
                  Remove answer
                </div>

                {quiz.answers.map((answer, answerIndex) => <div key={answerIndex} className="row mx-0">
                  <div className="col-auto">{answerIndex + 1}. </div>
                  <input
                    name='answer'
                    type="text"
                    className={`col form-control form-control-sm my-1`}
                    autoComplete="off"
                    value={answer}
                    onChange={event => handleAnswerChange(quizIndex, answerIndex, event.target.value)}
                    required
                  />
                </div>)}
              </div>
            </div>
          ))}
        </div>
      </div >
      <button type="submit" className="btn btn-orange my-3 text-white">
        Create new
      </button>
    </form>
  );
};

export {
  Editor
}
