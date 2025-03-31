export const saveData = (data, entity) => new Promise((resolve, reject) => {
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(data)
    };
    
    fetch(`/api/dataentities/${entity}/documents`, options)
    .then(response => response.json())
    .then(response => {
        resolve(response)
    })
    .catch(err => reject(err));
})