const axios = require('axios');
const xml2js = require('xml2js');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the first number: ', (intA) => {
    rl.question('Enter the second number: ', (intB) => {
        rl.close();
        const soapRequest = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">
                                <soap:Header/>
                                    <soap:Body>
                                        <tem:Multiply>
                                            <tem:intA>${intA}</tem:intA>
                                            <tem:intB>${intB}</tem:intB>
                                        </tem:Multiply>
                                    </soap:Body>
                            </soap:Envelope>`;

        const url = 'http://www.dneonline.com/calculator.asmx?wsdl';

        const headers = {
            'Content-Type': 'text/xml;charset=UTF-8',
            'SOAPAction': 'http://tempuri.org/Multiply',
        };

        axios.post(url, soapRequest, { headers })
            .then(response => {
                const soapResponse = response.data;

                xml2js.parseString(soapResponse, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML response:', err);
                    } else {
                        const multiplyResult = result['soap:Envelope']['soap:Body'][0]['MultiplyResponse'][0]['MultiplyResult'][0];

                        console.log('Multiplication Result:', multiplyResult);
                    }
                });
            })
            .catch(error => {
                console.error('Error making SOAP request:', error);
            });
    });
});
