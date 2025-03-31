export const sendAttachment = (file, document, field, entitiy) => new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    const formdata = new FormData();

    formdata.append("file", file, file.name);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch(`/api/dataentities/${entitiy}/documents/${document}/${field}/attachments`, requestOptions)
        .then(response => response.text())
        .then(result => resolve(result))
        .catch(error => reject(error));
});