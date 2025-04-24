const saveData = (data, entity) =>
  new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    }

    fetch(`/api/dataentities/${entity}/documents`, options)
      .then((response) => response.json())
      .then((response) => {
        resolve(response)
      })
      .catch((err) => reject(err))
  })

const saveAttachment = (files, document, field) =>
  new Promise((resolve, reject) => {
    var myHeaders = new Headers()

    var formdata = new FormData()

    files[field].map((file) => {
      formdata.append('file', file, file.name)
    })

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    }

    fetch(
      `/api/dataentities/RS/documents/${document}/${field}/attachments`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => resolve(result))
      .catch((error) => reject('error', error))
  })

const validateForm = (required, data) =>
  new Promise((resolve, reject) => {
    let valid = []
    let error = []

    required.map((elem) => {
      if (
        data[elem.name] != '' &&
        data[elem.name] != null &&
        data[elem.name] != undefined
      )
        valid.push(elem)
      else error.push(elem)
    })

    resolve({
      valid: valid,
      error: error,
      status: required.length == valid.length,
    })
  })

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
}

export { saveAttachment, saveData, validateEmail, validateForm }
