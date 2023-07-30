import { useEffect, useState } from "react";
import { useAccount } from "../../../contexts";
import { createReadingTip, deleteReadingTipById, updateReadingTip, updateReadingTipNoThumbnail } from "../../../api";
import { BUTTON_STATE } from "../../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { ButtonSubmit } from "../../../components";

const EDITOR_STATE = {
  CREATE: 'Create',
  UPDATE: 'Update'
}

const Editor = ({ reloadReadingTipsList, changeToCreateMode, readingTipInit }) => {
  const accountContext = useAccount();
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnail, setThumbnail] = useState(undefined);
  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE);

  useEffect(() => {
    setTitle(readingTipInit.title || '')
    setContent(readingTipInit.content || '')
    document.getElementById('thumbnail').value = null
  }, [readingTipInit])

  const handleTitleChange = event => {
    setTitle(event.target.value)
  }

  const handleContentChange = event => {
    setContent(event.target.value)
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
      const response = await createReadingTip(formBody);
      if (response.status === 201) {
        setButtonState(BUTTON_STATE.SUCCESS);
        reloadReadingTipsList()
        setTitle('')
        setContent('')
        setThumbnail(undefined)
        document.getElementById('thumbnail').value = null
        reloadReadingTipsList()
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
        response = await updateReadingTipNoThumbnail(readingTipInit._id, formBody)
      } else response = await updateReadingTip(readingTipInit._id, formBody);
      if (response.status === 200) {
        setButtonState(BUTTON_STATE.SUCCESS);
        reloadReadingTipsList()
        changeToCreateMode()
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
    create({
      title,
      content,
      thumbnail,
      creator: accountContext._id,
    })
  };

  const handleUpdate = event => {
    event.preventDefault();
    update({
      title,
      content,
      thumbnail,
      creator: accountContext._id,
    })
  };

  const handleDelete = async () => {
    try {
      setButtonState(BUTTON_STATE.PENDING);
      const response = await deleteReadingTipById(readingTipInit._id);
      if (response.status === 200) {
        setButtonState(BUTTON_STATE.SUCCESS);
        changeToCreateMode()
        reloadReadingTipsList()
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
    <form onSubmit={readingTipInit ? handleUpdate : handleCreate} >
      <div className="row text-orange">
        <h2>
          <FontAwesomeIcon icon={faEdit} /> <strong>{readingTipInit ? EDITOR_STATE.UPDATE : EDITOR_STATE.CREATE}</strong>
        </h2>
      </div>
      <div style={{ height: '60vh', overflowY: 'scroll' }} className="border rounded rounded-sm p-3 bg-light">
        <div className="form-group my-2">
          <label htmlFor='thumbnail'>
            Thumbnail {!readingTipInit && <span className="text-danger">*</span>}
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
            required={!readingTipInit}
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
      </div >

      <ButtonSubmit
        resetState={resetState}
        buttonState={buttonState}
        title={readingTipInit ? 'Update' : 'Create new'}
        className="btn btn-orange my-3 text-white"
        classNameRejected="btn btn-danger my-3 text-white"
      />

      {readingTipInit && <>
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
