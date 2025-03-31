import { useLayoutEffect, useEffect, useState } from "react"
import { useRuntime } from 'vtex.render-runtime'
import { Input, Dropdown, Dropzone, Checkbox, Textarea, RadioGroup, Button, ButtonWithIcon, DatePicker } from 'vtex.styleguide'

import styles from "../../../styles/css/template.forms.css"

import { mask, saveData, saveAttachment, validateEmail, validateForm } from "../../../utils/Forms"


const Field = ({props, type, elem, data, setData, file, setFile, typeFiles, setTypeFiles, required, setRequired, message, setMessage, modal, setModal, send, setSend }) => {

    const { navigate } = useRuntime()
    const [current, setCurrent] = useState(send ? null : elem.checked != undefined ? elem.checked : null)

    const [document, setDocument] = useState(null)
    const [upload, setUpload] = useState({ file:{}, result: {} })
    const [zipCode, setZipcode] = useState("")
    const [ errorMessageCustom, setErrorMessageCustom ] = useState(false);

    const options = {
        allowedOutdatedData: ['paymentData'],
    }

    const filterError = message?.error?.filter(find => { 
        if(find.name == elem.name)
            return find 
    })

    const errorMessage = {
        "Data Entity not found.": "Entidade de dados não encontrada"
    }

    useLayoutEffect(() => {
        let newFile = typeFiles
        if(elem.type === "file") {
            newFile.push(elem.name)
            setTypeFiles(newFile)
        }

        let newRequired = required
        if(elem.required) {

            let filter = newRequired.filter(find => {
                return find.name == elem.name
            })

            if(filter.length == 0) {
                newRequired.push({ name: elem.name, label: elem?.label ? elem?.label : elem.placeholder })
                setRequired(newRequired)
            }
        }

        if(elem.checked && data == null || elem.checked && data[elem.name] == undefined && data[elem.name] == null) {
            setData({ ...data, [elem.name]: elem.checked });
        }

    })

    const changeHandlerMask = ev => {
        let name = ev.currentTarget.name;
        let type = ev.currentTarget.getAttribute("type");
        let value = ev.currentTarget.value;
        setCurrent(mask(value, type))
    }

    const changeHandler = ev => {
        let name = ev.currentTarget.name;
        let value = ev.currentTarget.value;
        setData({ ...data, [name]: value });
    }

    const changeCheck = (name, value) => {
        setCurrent(!value)
    }

    const changeRadio = (name) => {
        setCurrent(name)
    }

    useEffect(() => { 
        setData({ ...data, [elem.name]: current });
    }, [current])

    const handleFile = (files) => {
        let names = []

        files.map(item => {
            names.push(item.name)
        })

        setFile({ ...file, [elem.name]: files })
        setData({ ...data, [elem.name]: names.join(",") });
    }
    
    const handleReset = (files) => {
        if (files) {
            console.log(files)
        }
    }

    function randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }   

    const sendForm = (e, type) => {
        e.preventDefault()
        
        validateForm(required, data).then(response => {
            setErrorMessageCustom(false);

                if(response.status) {
                    let fieldsImage = []
                    let typeFileUnique = typeFiles.filter(function(item, pos) {
                        return typeFiles.indexOf(item) == pos;
                    })
    
                    typeFileUnique.map(types => {
                        let getImage = data[types].split(",")
                        getImage.map(image => {
                            fieldsImage.push({ [types]: image })
                        })
                    })
    
                    data.anexos = JSON.stringify(fieldsImage)
    
                    saveData(data, props.entity, props.title).then(document => {
    
                        typeFiles.length > 0 &&
                            typeFiles.map(field => {
                                saveAttachment(file, document.DocumentId, field)
                            })
                            
                        if(document.Id != undefined) {
                            setMessage({text: `## ${props.message.success}`, type: "success"})
                            navigate({
                                scrollOptions: {
                                    baseElementId: "message",
                                    behavior: 'smooth',
                                    left: 0,
                                    top: 150
                                }
                            })
                            setCurrent(null)
                            setSend(true)
    
                        } else {
                            setMessage({text: `## ${props.message.error} \n\n ${errorMessage[document.Message]}`, type: "error"})
                            navigate({
                                scrollOptions: {
                                    baseElementId: "message",
                                    behavior: 'smooth',
                                    left: 0,
                                    top: 150
                                }
                            })
    
                        }
                    })
                    
                    setData(null)
                } else {
                    let messageError = ""
    
                    response.error.map(elem => {
                        messageError += `\n O campo **${elem?.label}** não está correto...`
                    })
                    
                    setMessage({ text: `## ${props.message.error} \n\n ${messageError}`, type: "alert", error: response.error})
                    navigate({
                        scrollOptions: {
                            baseElementId: "message",
                            behavior: 'smooth',
                            left: 0,
                            top: 150
                        }
                    })
                }
        })

    }

    useEffect(() => { 
        if (zipCode.length == 9) {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
                };
                
            fetch("https://viacep.com.br/ws/" + zipCode + "/json/", requestOptions)
            .then(response => response.text())
            .then(result => {
                let res = JSON.parse(result)
                setData({ ...data, 
                    address: true,
                    zipcode: res.cep,
                    street: res.logradouro,
                    neighborhood: res.bairro,
                    city: res.localidade,
                    state: res.uf
                });
            })
            .catch(error => console.log('error', error));
        }
    }, [zipCode])

    const findZipCode = (value) => {
        let maskCep = value.replace(/(\d{5})(\d{3})/g, "\$1-\$2")
        setZipcode(maskCep)
    };
    
    const mask = (typed, type) => {
        
        if(type == "date") {
            if (typed.length <= 8) {
                let regex = /^([0-9]{2})([0-9]{4,5})([0-9]{4})$/;
                let str = typed.replace(/[^0-9]/g, "").slice(0, 12);
                return str.replace(regex, "$1/$2/$3");
            }
        } else if(type == "phone") {
            if (typed.length <= 14) {
                let regex = /^([0-9]{2})([0-9]{4,5})([0-9]{4})$/;
                let str = typed.replace(/[^0-9]/g, "").slice(0, 12);
                return str.replace(regex, "($1)$2-$3");
            }
        } else if (type === 'cep') {
            if (typed.length <= 9) 
                return typed.replace(/(\d{5})(\d{3})/g, "\$1-\$2");
        } else if (type === 'cpf') {
            if (typed.length <= 11) 
                return typed.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
        } else if (type === 'cnpj') {
            if (typed.length <= 14) 
                return typed.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5");
        } else if (type === 'cpfcnpj') {
            let cpfcnpj = typed.replace(/[\/.-]/g, '');
    
            if (cpfcnpj.length <= 11)
                cpfcnpj = cpfcnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
            
            if (cpfcnpj.length >= 12 && cpfcnpj.length <= 18) 
                cpfcnpj = cpfcnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5");
            
            return cpfcnpj
        } else {
            return typed
        }
    }

    return(
        <div className={`${styles.formGroup} ${styles[elem.name]} ${styles[elem.type]}`} style={elem.size && {width: elem.size == "100%" ? "100%" : `calc(${elem.size} - ${props.gap})`}}>
            {
                props.showLabel && type != "title" && type != "submit" && type != "whatsapp" && <label>{ elem.__editorItemTitle }</label>
            }
            {
                type == "title" && <h2>{elem?.label}</h2>
            }
            {
                type == "submit" &&
                    <div>
                        <button onClick={(e) => { sendForm(e) }}>{elem.icon && <img src={elem.icon} alt={elem.__editorItemTitle} />}{elem.__editorItemTitle}</button>
                        <p style={{color: 'red'}}>{errorMessageCustom ? 'Todos os campos devem ser preenchidos' : ''}</p>
                    </div>
            }       
            {
                type == "whatsapp" &&
                    <button onClick={(e) => { sendForm(e, "whatsapp") }}>{elem.icon && <img src={elem.icon} alt={elem?.label} />}{elem?.label}</button>
            }
            {  
                type == "cep" &&
                    <Input 
                        errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                        error={ filterError?.length > 0 ? true : false} 
                        placeholder={elem.placeholder} 
                        value={current} 
                        label={elem?.label} 
                        type={elem.type} 
                        name={elem.name} 
                        onChange={changeHandlerMask} 
                        autoComplete="nope"
                        maxLength="9" 
                    />
            }
            {  
                type == "date" &&
                    <Input 
                        errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                        error={ filterError?.length > 0 ? true : false} 
                        placeholder={elem.placeholder} 
                        value={current} 
                        label={elem?.label} 
                        type={elem.type} 
                        name={elem.name} 
                        onChange={changeHandler} 
                        autoComplete="nope"
                        maxLength="8" 
                    />
            }
            {  
                type == "phone" &&
                    <Input 
                        errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                        error={ filterError?.length > 0 ? true : false} 
                        placeholder={elem.placeholder} 
                        value={current} 
                        label={elem?.label} 
                        type={elem.type} 
                        name={elem.name} 
                        onChange={changeHandlerMask} 
                        autoComplete="nope"
                        maxLength="14" 
                    />
            }
            {  
                type == "cpf" &&
                    <Input 
                        errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                        error={ filterError?.length > 0 ? true : false} 
                        placeholder={elem.placeholder} 
                        value={current} 
                        label={elem?.label} 
                        type={elem.type} 
                        name={elem.name} 
                        onChange={changeHandlerMask} 
                        autoComplete="nope"
                        maxLength="14" 
                    />
            }
            {  
                type == "cnpj" &&
                    <Input 
                        errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                        error={ filterError?.length > 0 ? true : false} 
                        placeholder={elem.placeholder} 
                        value={current} 
                        label={elem?.label} 
                        type={elem.type} 
                        name={elem.name} 
                        onChange={changeHandlerMask} 
                        autoComplete="nope"
                        maxLength="18" 
                    />
            }
            {  
                type == "cpfcnpj" &&
                    <Input 
                        errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                        error={ filterError?.length > 0 ? true : false} 
                        placeholder={elem.placeholder} 
                        value={current} 
                        label={elem?.label} 
                        type={elem.type} 
                        name={elem.name} 
                        onChange={changeHandlerMask} 
                        autoComplete="nope"
                        maxLength="18" 
                    />
            }
            {
                type == "email" &&
                    <Input 
                        errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                        error={ filterError?.length > 0 ? true : false} 
                        placeholder={elem.placeholder} 
                        value={current} 
                        label={elem?.label} 
                        type={elem.type} 
                        name={elem.name} 
                        onChange={changeHandlerMask} 
                        autoComplete="nope"
                        maxLength={elem.maxLength} 
                    />
            }
            {  
                type == "text" &&
                    <Input 
                        errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                        error={ filterError?.length > 0 ? true : false} 
                        placeholder={elem.placeholder} 
                        value={current} 
                        label={elem?.label} 
                        type={elem.type} 
                        name={elem.name} 
                        onChange={changeHandlerMask} 
                        maxLength={elem.maxLength} 
                        autoComplete="nope"
                    />
            }
            {  
                type == "textarea" &&
                    <Textarea 
                        errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                        error={ filterError?.length > 0 ? true : false} 
                        placeholder={elem.placeholder} 
                        value={current} 
                        label={elem?.label} 
                        type={elem.type} 
                        name={elem.name} 
                        onChange={changeHandlerMask} 
                        maxLength={elem.maxLength} 
                        autoComplete="nope"
                    />
            }
            {
                type == "checkbox" &&
                    <Checkbox
                        errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                        error={ filterError?.length > 0 ? true : false} 
                        checked={current}
                        id={elem.name}
                        label={elem?.label}
                        name={elem.name}
                        onChange={e => changeCheck(elem.name, current)}
                        value={elem.name}
                        className={styles[elem.name]}
                        autoComplete="nope"
                    />
            }
            {
                type == "radio" &&
                    <>
                        {elem?.label}
                        <RadioGroup
                            errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                            error={ filterError?.length > 0 ? true : false} 
                            checked={current == elem.name ? "checked" : ""}
                            id={elem.name}
                            name={elem.name}
                            options={elem.options}
                            value={current}
                            onChange={e => changeRadio(e.currentTarget.value)}
                            className={styles[elem.name]}
                        />
                    </>
            }
            {
                type == "checkbox-description" &&
                    <div className={styles.wrapperDescription}>
                        <Checkbox
                            errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                            error={ filterError?.length > 0 ? true : false} 
                            checked={current}
                            id={elem.name}
                            label={elem?.label}
                            name={elem.name}
                            onChange={e => changeCheck(elem.name, current)}
                            value={elem.name}
                            className={styles[elem.name]}
                            autoComplete="nope"
                        />
                        <label className={`vtex-checkbox__label ${styles.inputDescription}`} dangerouslySetInnerHTML={{__html: elem.description}}></label>
                    </div>
            }
            {
                type == "select" &&
                        <Dropdown
                            errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                            error={ filterError?.length > 0 ? true : false} 
                            className={styles[elem.name]}
                            name={elem.name}
                            label={elem?.label}
                            placeholder={elem.placeholder}
                            options={elem.options}
                            value={current}
                            onChange={(e) => changeHandlerMask(e)}
                            // onBlur={(e) => changeHandlerMask(e)}
                            autoComplete="nope"
                        />
            }
            {  
                type == "address" ?
                    <div className={styles.address}>
                        <input type="hidden" name={elem.name} label={elem?.label} />
                        <div className={`${styles.formGroup} ${styles.zipcode}`} style={{width: `calc(30% - ${props.gap})`}}>
                            <label for="zipcode">CEP</label>
                            <Input 
                                errorMessage={filterError?.length > 0 ? `Campo CEP é inválido!` : ""} 
                                error={ filterError?.length > 0 ? true : false} 
                                className={styles.zipcode}
                                autoComplete="nope" 
                                name="zipcode" 
                                placeholder="Digite o CEP" 
                                value={zipCode} 
                                onChange={ (e) => { findZipCode(e.currentTarget.value) }} 
                                maxLength="9" 
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.street}`} style={{width: `calc(70% - ${props.gap})`}}>
                            <label for="street">Rua</label>
                            <Input 
                                errorMessage={filterError?.length > 0 ? `Campo LOGRADOURO é inválido!` : ""} 
                                error={ filterError?.length > 0 ? true : false} 
                                className={styles.street}
                                autoComplete="nope" 
                                name="street" 
                                value={data?.street} 
                                placeholder="Logradouro"
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.number}`} style={{width: `calc(33.3333% - ${props.gap})`}} >
                            <label for="number">Número</label>
                            <Input 
                                errorMessage={filterError?.length > 0 ? `Campo NÚMERO é inválido!` : ""} 
                                error={ filterError?.length > 0 ? true : false} 
                                className={styles.number}
                                autoComplete="nope" 
                                name="number" 
                                placeholder="Número" 
                                onChange={changeHandler} 
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.complement}`} style={{width: `calc(33.3333% - ${props.gap})`}} >
                            <label for="complement">Complemento</label>
                            <Input 
                                autoComplete="nope" 
                                name="complement" 
                                placeholder="Complemento" 
                                onChange={changeHandler} 
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.neighborhood}`} style={{width: `calc(33.3333% - ${props.gap})`}} >
                            <label for="neighborhood">Bairro</label>
                            <Input 
                                errorMessage={filterError?.length > 0 ? `Campo BAIRRO é inválido!` : ""} 
                                error={ filterError?.length > 0 ? true : false} 
                                className={styles.neighborhood}
                                autoComplete="nope" 
                                name="neighborhood" 
                                value={data?.neighborhood} 
                                placeholder="Bairro" 
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.city}`} style={{width: `calc(50% - ${props.gap})`}} >
                            <label for="city">Cidade</label>
                            <Input 
                                errorMessage={filterError?.length > 0 ? `Campo CIDADE é inválido!` : ""} 
                                error={ filterError?.length > 0 ? true : false} 
                                className={styles.city}
                                autoComplete="nope" 
                                name="city" 
                                value={data?.city} 
                                placeholder="Cidade" 
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.state}`} style={{width: `calc(50% - ${props.gap})`}} >
                            <label for="state">Estado</label>
                            <Input 
                                errorMessage={filterError?.length > 0 ? `Campo ESTADO é inválido!` : ""} 
                                error={ filterError?.length > 0 ? true : false} 
                                className={styles.state}
                                autoComplete="nope"
                                name="state" 
                                value={data?.state} 
                                placeholder="Estado" 
                            />
                        </div>
                    </div>
                : null
            }
            {
                type == "file" &&
                        <div className={styles.inputFile}>
                            <label htmlFor="">IMAGENS INTERNAS/EXTERNAS DA LOJA. OS ARQUIVOS DAS IMAGENS DEVEM TER NO MÁXIMO 2M CADA:</label>
                            <Dropzone
                                onDropAccepted={handleFile}
                                onFileReset={handleReset}
                                multiple={elem.multiple}
                                accept={elem.accept}
                                errorMessage={filterError?.length > 0 ? `Campo ${elem.label ? elem.label : elem.placeholder } é inválido!` : ""} 
                                error={ filterError?.length > 0 ? true : false} 
                            >
                                <div className="pt7">
                                    <div>
                                    <span className="f4">Solte aqui suas imagens ou </span>
                                    <span className="f4 c-link" style={{ cursor: 'pointer' }}>
                                        selecione um arquivo
                                    </span>
                                    </div>
                                </div>
                            </Dropzone>
                        </div>
                }
        </div>
    )
}

export default Field