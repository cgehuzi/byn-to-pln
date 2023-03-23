import React, { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Card, Form } from 'react-bootstrap';

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
      <div className="app__body">
        <div className="container">
          <div className="app__wrap">
            <div className="app__wrap-form">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="app__form">
                    <div className="app__form-header">
                      <div className="app__form-title">EUR</div>
                      <div className="app__form-result">
                        <span>{priceFormat(eurPlnValue)}</span> PLN
                      </div>
                    </div>
                    <div className="app__form-body">
                      <Form.Group className="app__form-group">
                        <Form.FloatingLabel
                          controlId="eurByn"
                          label={
                            <span className="app__form-label">
                              <span>BYN</span> <span>{bynRates.eur}</span>
                            </span>
                          }
                        >
                          <Form.Control
                            type="text"
                            inputMode="decimal"
                            onChange={handleBynChange}
                            value={bynValue}
                          />
                        </Form.FloatingLabel>
                      </Form.Group>
                      <Form.Group className="app__form-group">
                        <Form.FloatingLabel
                          controlId="eur"
                          label={
                            <span className="app__form-label">
                              <span>EUR</span> <span>{plnRates.eur}</span>
                            </span>
                          }
                        >
                          <Form.Control
                            type="text"
                            inputMode="decimal"
                            onChange={handleEurChange}
                            value={eurValue}
                          />
                        </Form.FloatingLabel>
                      </Form.Group>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="app__wrap-form">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="app__form">
                    <div className="app__form-header">
                      <div className="app__form-title">USD</div>
                      <div className="app__form-result">
                        <span>{priceFormat(usdPlnValue)}</span> PLN
                      </div>
                    </div>
                    <div className="app__form-body">
                      <Form.Group className="app__form-group">
                        <Form.FloatingLabel
                          controlId="usdByn"
                          label={
                            <span className="app__form-label">
                              <span>BYN</span> <span>{bynRates.usd}</span>
                            </span>
                          }
                        >
                          <Form.Control
                            type="text"
                            inputMode="decimal"
                            onChange={handleBynChange}
                            value={bynValue}
                          />
                        </Form.FloatingLabel>
                      </Form.Group>
                      <Form.Group className="app__form-group">
                        <Form.FloatingLabel
                          controlId="usd"
                          label={
                            <span className="app__form-label">
                              <span>USD</span> <span>{plnRates.usd}</span>
                            </span>
                          }
                        >
                          <Form.Control
                            type="text"
                            inputMode="decimal"
                            onChange={handleUsdChange}
                            value={usdValue}
                          />
                        </Form.FloatingLabel>
                      </Form.Group>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
