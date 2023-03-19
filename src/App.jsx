import React, { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Card, Form, Navbar } from 'react-bootstrap';

const bynPath = 'https://developerhub.alfabank.by:8273/partner/1.0.1/public/nationalRates';
const plnPath = 'https://api.nbp.pl/api/exchangerates/tables/c?format=json';

function App() {
  const [bynRates, setBynRates] = useState({ eur: 0, usd: 0 });
  const [bynLoaded, setBynLoaded] = useState(false);
  const [plnRates, setPlnRates] = useState({ eur: 0, usd: 0 });
  const [plnLoaded, setPlnLoaded] = useState(false);
  const [bynValue, setBynValue] = useState(3725);
  const [usdValue, setUsdValue] = useState(0);
  const [usdPlnValue, setUsdPlnValue] = useState(0);
  const [eurValue, setEurValue] = useState(0);
  const [eurPlnValue, setEurPlnValue] = useState(0);

  const priceFormat = (price) => {
    const formatter = new Intl.NumberFormat('ru', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(Number(price));
  };

  const calcByn = (value) => {
    const bynEur = value / bynRates.eur;
    setEurValue(priceFormat(bynEur));
    const eurPln = bynEur * plnRates.eur;
    setEurPlnValue(eurPln);

    const bynUsd = value / bynRates.usd;
    setUsdValue(priceFormat(bynUsd));
    const usdPln = bynUsd * plnRates.usd;
    setUsdPlnValue(usdPln);
  };

  const calcEur = (value) => {
    const eurPln = value * plnRates.eur;
    setEurPlnValue(eurPln);
  };

  const calcUsd = (value) => {
    const usdPln = value * plnRates.usd;
    setUsdPlnValue(usdPln);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(bynPath);
        const { rates } = response.data;
        const bynEur = _.find(rates, { iso: 'EUR' });
        const bynUsd = _.find(rates, { iso: 'USD' });
        setBynRates({
          eur: bynEur.rate,
          usd: bynUsd.rate,
        });
        setBynLoaded(true);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(plnPath);
        const { rates } = response.data[0];
        const plnEur = _.find(rates, { code: 'EUR' });
        const plnUsd = _.find(rates, { code: 'USD' });
        setPlnRates({
          eur: plnEur.bid,
          usd: plnUsd.bid,
        });
        setPlnLoaded(true);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (bynLoaded && plnLoaded) calcByn(bynValue);
  }, [bynLoaded, plnLoaded]);

  const handleBynChange = (e) => {
    const { value } = e.target;
    setBynValue(value);
    calcByn(value);
  };

  const handleEurChange = (e) => {
    const { value } = e.target;
    setEurValue(value);
    calcEur(value);
  };

  const handleUsdChange = (e) => {
    const { value } = e.target;
    setUsdValue(value);
    calcUsd(value);
  };

  return (
    <div className="app">
      <Navbar expand="lg" className="app__header shadow-sm bg-white">
        <div className="container">
          <Navbar.Brand className="me-3" href="/">
            BYN to PLN converter
          </Navbar.Brand>
        </div>
      </Navbar>
      <div className="app__body my-5">
        <div className="container">
          <div className="app__wrap">
            <div className="app__wrap-form">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="app__form">
                    <div className="app__form-title">EUR</div>
                    <Form.Group className="app__form-group">
                      <Form.FloatingLabel controlId="byn1" label="BYN">
                        <Form.Control
                          type="text"
                          inputMode="decimal"
                          onChange={handleBynChange}
                          value={bynValue}
                        />
                      </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group className="app__form-group">
                      <Form.FloatingLabel controlId="eur" label="EUR">
                        <Form.Control
                          type="text"
                          inputMode="decimal"
                          onChange={handleEurChange}
                          value={eurValue}
                        />
                      </Form.FloatingLabel>
                    </Form.Group>
                    <div className="app__form-result">
                      <span>{priceFormat(eurPlnValue)}</span> PLN
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="app__wrap-form">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="app__form">
                    <div className="app__form-title">USD</div>
                    <Form.Group className="app__form-group">
                      <Form.FloatingLabel controlId="byn2" label="BYN">
                        <Form.Control
                          type="text"
                          inputMode="decimal"
                          onChange={handleBynChange}
                          value={bynValue}
                        />
                      </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group className="app__form-group">
                      <Form.FloatingLabel controlId="usd" label="USD">
                        <Form.Control
                          type="text"
                          inputMode="decimal"
                          onChange={handleUsdChange}
                          value={usdValue}
                        />
                      </Form.FloatingLabel>
                    </Form.Group>
                    <div className="app__form-result">
                      <span>{priceFormat(usdPlnValue)}</span> PLN
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="app__wrap-rates _byn"></div>
            <div className="app__wrap-rates _pln"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
