export default class ServiceExemple {
    //esse eh um exemplo de service
    //essa rota, eh um exemplo de rota declarada dentro do service node
    //os services servem para consumir apis e apis privadas
    async getAllInfoClient(id) {
        const data = await fetch(
            `/clientapi/getInfoClient/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        return data.json();
    }
}