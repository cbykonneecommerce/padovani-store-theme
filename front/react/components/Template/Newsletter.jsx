import { useState, useEffect } from "react";
import styles from "../../styles/css/template.newsletter.css";
import Loading from "../../UI/Loading/Loading";

import { Dropdown } from 'vtex.styleguide'
const Newsletter = (props) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isSuccessSubmited, setIsSuccessSubmited] = useState(null);
  const [view, setView] = useState(false);
  const options = [
    { value: 'Banheiro', label: 'Banheiro' },
    { value: 'Cozinha e Lavandeira', label: 'Cozinha e Lavandeira' },
    { value: 'Ferramentas', label: 'Ferramentas' },
    { value: 'Pintura', label: 'Pintura' },
    { value: 'Utilidades Domésticas', label: 'Utilidades Domésticas' },
    { value: 'Todos os Departamentos', label: 'Todos os Departamentos' },
  ]

  const values = {
    title: isHome ? props.title : props.titleDefault,
    subtitle: isHome ? props.subtitle : props.subtitleDefault,
    buttonText: isHome ? props.buttonText : props.buttonTextDefault,
    icon: isHome ? props.icon : props.iconDefault,
  };
  
  const submitHandler = (ev) => {
    ev.preventDefault();
    setLoading(true);
    const entity = isHome ? "NL" : "ND";

    const url = `/api/dataentities/${entity}/documents`;

    const settings = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.vtex.ds.v10+json",
      },
      body: JSON.stringify(data),
    };

    fetch(url, settings)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        setLoading(false);
        setSubmited(true);
        setIsSuccessSubmited(true);

        setTimeout(() => {
          setSubmited(false);
          setIsSuccessSubmited(null);
          setData({});
        }, 3000);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        setLoading(false);
        setSubmited(true);
        setIsSuccessSubmited(false);
        setTimeout(() => {
          setSubmited(false);
          setIsSuccessSubmited(null);
        }, 3000);
      });
  };

  const changeHandler = (ev) => {
    let name = ev.currentTarget.name;
    let value = ev.currentTarget.value;
    setData({ ...data, [name]: value });
  };

  const checkPageIsHome = () => {
    const href = window.location.href.split("/");
    if (href[3]) {
        setIsHome(false);
    } else {
        setIsHome(true);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setView(true);
    }, 1000);
  }, [data]);

  useEffect(() => {
    checkPageIsHome()
  }, []);

  if (!view) return null;

  return (
    <section className={styles.mainNewsLetter}>
      <div className={styles.containerNewsLetter}>
        <div className={styles.mainTitle} style={styles.title}>
            {values.icon && (
              <img src={values?.icon} alt="Icone da newsletter" />
            )}
            <h2>{values.title}</h2>
            <p className={styles.smallTitle}>{values.subtitle}</p>
        </div>

        {!submited && (
            <form onSubmit={submitHandler}>
            {isHome ? (
                <input
                type="text"
                name="name"
                placeholder="seu nome aqui"
                required
                onInput={changeHandler}
                /> 
              ) : (
                <Dropdown
                placeholder="Clique aqui e escolha"
                options={options}
                name="nd_departament"
                required
                value={data?.nd_departament}
                onChange={changeHandler}
                autoComplete="nope"
                />
              )}

              <input
              type="email"
              name="nd_email"
              placeholder="seu e-mail"
              required
              onChange={changeHandler}
              />
            <button className={styles.mainNewsButton} type="submit">{loading ? <Loading /> : values.buttonText}</button>
            </form>
        )}

        {submited && (
          <div className={styles.thanksNewsLetter}>
            <p className={isSuccessSubmited ? styles.NewsLetterSuccess : styles.NewsLetterError}>
              {isSuccessSubmited
                ? "Cadastro concluído com sucesso"
                : "Erro. Tente novamente mais tarde."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

Newsletter.schema = {
  title: "Newsletter",
  type: "object",
  properties: {
    title: {
      title: "Título [HOME]",
      type: "string",
    },
    subtitle: {
      title: "Subtítulo [HOME]",
      type: "string",
    },
    buttonText: {
        title: "Texto do botão [HOME]",
        type: "string",
    },
    icon: {
        title: "Ícone/Imagem [HOME]",
        type: "string",
        widget: {
            'ui:widget': 'image-uploader',
        }, 
    },
    titleDefault: {
      title: "Título [outras paginas]",
      type: "string",
    },
    subtitleDefault: {
      title: "Subtítulo [outras paginas]",
      type: "string",
    },
    buttonTextDefault: {
        title: "Texto do botão [outras paginas]",
        type: "string",
    },
    iconDefault: {
        title: "Ícone/Imagem [outras]",
        type: "string",
        widget: {
            'ui:widget': 'image-uploader',
        }, 
    }
  },
};

export default Newsletter;
