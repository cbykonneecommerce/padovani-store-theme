// essa funcão tem por objetivo esperar um elemento existir para só assim captura-lo.
// caso contrário, a primeira vez que tentar capturar o componente ainda não vai
//existir em tela e vai retornar null
export default function waitForEl(selector) {
    return new Promise((resolve) => {
        function waitForElCb(selector) {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
            } else {
                setTimeout(function () {
                    waitForElCb(selector);
                }, 100);
            }
        }
        waitForElCb(selector);
    });
  }
  