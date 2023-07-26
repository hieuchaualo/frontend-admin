import { useEffect, useState } from "react";
import { useAccount } from "../../..//contexts";
import { createMiniTest, deleteMiniTestById, updateMiniTest, updateMiniTestNoThumbnail } from "../../../api";
import { BUTTON_STATE, getMiniTestType } from "../../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { ButtonSubmit } from "../../../components";

const EDITOR_STATE = {
  CREATE: 'Create',
  UPDATE: 'Update'
}

const quizInit = {
  question: '',
  options: [],
  answers: [''],
}

const timeLimitInit = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  isDisabled: false,
}

const secondToTimeLimitFormat = second => {
  second = Number(second)
  const hours = Math.floor(second / 3600)
  const minutes = Math.floor((second % 3600) / 60)
  const seconds = Math.floor((second % 3600) % 60)
  return {
    hours,
    minutes,
    seconds,
    isDisabled: false,
  }
}

const calculateTimeLimit = (title, content, quizzesLength) => {
  const titleWordCount = title.split(' ').length
  const contentWordCount = content.split(' ').length
  const quizzesTimeLimit = quizzesLength * 30 // 30s per quiz
  const readingTimeLimit = Math.floor((titleWordCount + contentWordCount) / 150 * 60)// 150 per minutes * 60 sec
  return (readingTimeLimit + quizzesTimeLimit)
}

const Editor = ({ reloadMiniTestsList, changeToCreateMode, miniTestInit }) => {
  const accountContext = useAccount();
  const [title, setTitle] = useState('')
  const [timeLimitInput, setTimeLimitInput] = useState(timeLimitInit)
  const [content, setContent] = useState('')
  const [quizzes, setQuizzes] = useState([quizInit])
  const [thumbnail, setThumbnail] = useState(undefined);
  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE);

  useEffect(() => {
    setTitle(miniTestInit.title || '')
    setContent(miniTestInit.content || '')
    setQuizzes(miniTestInit.quizzes || [quizInit])
    setTimeLimitInput(miniTestInit.timeLimit ? secondToTimeLimitFormat(miniTestInit.timeLimit) : timeLimitInit)
    document.getElementById('thumbnail').value = null
  }, [miniTestInit])

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

  const create = async formBody => {
    try {
      setButtonState(BUTTON_STATE.PENDING);
      const response = await createMiniTest(formBody);
      if (response.status === 201) {
        setButtonState(BUTTON_STATE.SUCCESS);
        reloadMiniTestsList()
        setTitle('')
        setContent('')
        setQuizzes([quizInit])
        setTimeLimitInput(timeLimitInit)
        setThumbnail(undefined)
        document.getElementById('thumbnail').value = null
        reloadMiniTestsList()
      } else {
        setButtonState(BUTTON_STATE.ERROR);
      }
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.ERROR);
    }
  };

  const update = async formBody => {
    try {
      setButtonState(BUTTON_STATE.PENDING);
      let response
      if (!formBody.thumbnail) {
        response = await updateMiniTestNoThumbnail(miniTestInit._id, formBody)
      } else response = await updateMiniTest(miniTestInit._id, formBody);
      if (response.status === 200) {
        setButtonState(BUTTON_STATE.SUCCESS);
        reloadMiniTestsList()
        changeToCreateMode()
        setTimeLimitInput(timeLimitInit)
        setThumbnail(undefined)
        document.getElementById('thumbnail').value = null
      } else {
        setButtonState(BUTTON_STATE.ERROR);
      }
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.ERROR);
    }
  };

  const handleCreate = event => {
    event.preventDefault();
    const timeLimit = Number(timeLimitInput.seconds) + timeLimitInput.minutes * 60 + timeLimitInput.hours * 3600
    const typeOfQuiz = getMiniTestType(quizzes[0])
    create({
      title,
      content,
      quizzes,
      thumbnail,
      typeOfQuiz,
      timeLimit,
      creator: accountContext._id,
    })
  };

  const handleUpdate = event => {
    event.preventDefault();
    const timeLimit = Number(timeLimitInput.seconds) + timeLimitInput.minutes * 60 + timeLimitInput.hours * 3600
    const typeOfQuiz = getMiniTestType(quizzes[0])
    update({
      title,
      content,
      quizzes,
      thumbnail,
      typeOfQuiz,
      timeLimit,
      creator: accountContext._id,
    })
  };

  const handleDelete = async () => {
    try {
      setButtonState(BUTTON_STATE.PENDING);
      const response = await deleteMiniTestById(miniTestInit._id);
      if (response.status === 200) {
        setButtonState(BUTTON_STATE.SUCCESS);
        changeToCreateMode()
        reloadMiniTestsList()
      } else {
        setButtonState(BUTTON_STATE.ERROR);
      }
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.ERROR);
    }
  }

  const resetState = () => {
    setButtonState(BUTTON_STATE.ENABLE)
  }

  return (
    <form onSubmit={miniTestInit ? handleUpdate : handleCreate} >
      <div className="row text-orange">
        <h2>
          <FontAwesomeIcon icon={faEdit} /> <strong>{miniTestInit ? EDITOR_STATE.UPDATE : EDITOR_STATE.CREATE}</strong>
        </h2>
      </div>
      <div style={{ height: '60vh', overflowY: 'scroll' }} className="border rounded rounded-sm p-3 bg-light">
        <div className="form-group my-2">
          <label htmlFor='thumbnail'>
            Thumbnail {!miniTestInit && <span className="text-danger">*</span>}
          </label>
          <br />
          <small className="text-muted">
            File types supported: PNG, JPG, JPEG. Max size: 1MB
          </small>
          <input
            name='thumbnail'
            id='thumbnail'
            type="file"
            className={`form-control my-1`}
            onChange={handleThumbnailChange}
            accept='image/png, image/jpg, image/jpeg'
            required={!miniTestInit}
          />
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
          {quizzes.map((quiz, quizIndex) => (
            <div key={quizIndex} className="border rounded my-2 px-2 py-1 bg-white">
              <div className="fw-bold">Quiz {quizIndex + 1}</div>
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

                {quiz.options.map((option, optionIndex) => <div key={option} className="row mx-0">
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
              </div>

              <div className="form-group my-2">
                <label htmlFor='option'>
                  Answers: {quiz.answers.length} <span className="text-danger">*</span>
                </label>
                <br />

                {quiz.answers.map((answer, answerIndex) =>
                  <div key={answerIndex} className="row mx-0">
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
                  </div>
                )}

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
              </div>
            </div>
          ))}
        </div>

        <div className='btn btn-sm btn-primary' onClick={pushQuiz}>
          <FontAwesomeIcon icon={faPlus} className='me-2' />
          Add quiz
        </div>

        <div className={`btn btn-sm btn-sm btn-secondary ${quizzes.length === 1 && 'disabled'} ms-2`} onClick={popQuiz}>
          <FontAwesomeIcon icon={faXmark} className='me-2' />
          Remove quiz
        </div>


        <div className="row border rounded mt-3 mx-0 py-2 bg-white">
          <label>
            Time limit <span className="text-danger">*</span>
          </label>
          {/* <small className="text-muted">You can set all fields to zero for no time limit</small> */}
          <div className="col">
            <small className="text-muted">Hours:</small>
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="hours"
              aria-label="hours"
              min={0}
              value={timeLimitInput.hours}
              onChange={event => setTimeLimitInput({ ...timeLimitInput, hours: event.target.value })}
              disabled={timeLimitInput.isDisabled}
              required
            />
          </div>

          <div className="col">
            <small className="text-muted">Minutes:</small>
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="minutes"
              aria-label="minutes"
              min={0}
              max={59}
              value={timeLimitInput.minutes}
              onChange={event => setTimeLimitInput({ ...timeLimitInput, minutes: event.target.value })}
              required
              disabled={timeLimitInput.isDisabled}
            />
          </div>

          <div className="col">
            <small className="text-muted">Seconds:</small>
            <input
              type="number"
              className="form-control  form-control-sm"
              placeholder="seconds"
              aria-label="seconds"
              min={0}
              max={59}
              value={timeLimitInput.seconds}
              onChange={event => setTimeLimitInput({ ...timeLimitInput, seconds: event.target.value })}
              required
              disabled={timeLimitInput.isDisabled}
            />
          </div>

          <div className="row mx-0 mt-3">
            <div className="col px-0">
              <div
                className="btn btn-sm btn-outline-success w-100"
                onClick={() => setTimeLimitInput({
                  ...timeLimitInput,
                  ...secondToTimeLimitFormat(calculateTimeLimit(title, content, quizzes.length)),
                })}
              >
                Auto
              </div>
            </div>
            <div className="col px-2">
              <div
                className="btn btn-sm btn-outline-primary w-100"
                onClick={() => setTimeLimitInput({ ...timeLimitInput, isDisabled: false })}
              >
                Custom
              </div>
            </div>
            <div className="col px-0">
              <div
                className="btn btn-sm btn-outline-secondary w-100"
                onClick={() => setTimeLimitInput({ ...timeLimitInput, ...timeLimitInit, isDisabled: true })}
              >
                No limit
              </div>
            </div>
          </div>
        </div>

      </div >

      <ButtonSubmit
        resetState={resetState}
        buttonState={buttonState}
        title={miniTestInit ? 'Update' : 'Create new'}
        className="btn btn-orange my-3 text-white"
        classNameRejected="btn btn-danger my-3 text-white"
      />

      {miniTestInit && <>
        <div className="btn btn-outline-danger my-3 mx-2" onClick={handleDelete}>
          Delete
        </div>
        <div className="btn btn-outline-secondary my-3" onClick={changeToCreateMode}>Cancel</div>
      </>}
    </form>
  );
};

export {
  Editor,
  EDITOR_STATE,
}
