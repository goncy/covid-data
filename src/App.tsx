import React from "react";
import {Layout, PageHeader, Skeleton, Statistic, Typography, Card, Badge, Input, Button, Select} from "antd";
import styled from "styled-components";

import {Case} from "./types";
import {useCases} from "./hooks";

import "./theme.css";

const Content = styled(Layout.Content)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

const Box = styled(Card)`
  &:not(:last-child) {
    margin-bottom: 24px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

const Actions = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: 1fr 1fr;
`;

const Footer = styled(Layout.Footer)`
  background: gainsboro;
  text-align: center;
`;

export default function App() {
  const {data, loading, error} = useCases();
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<keyof Omit<Case, "country">>("cases");
  const [limit, setLimit] = React.useState(10);
  const results = React.useMemo(
    () =>
      data
        ? [...data]
            .sort((a, b) => b[filter] - a[filter])
            .filter(({country}) => country.toLowerCase().includes(query.toLowerCase()))
        : [],
    [data, filter, query],
  );

  React.useEffect(() => {
    setLimit(10);
  }, [query]);

  return (
    <Layout className="app">
      <PageHeader
        extra={[
          <Actions>
            <Input.Search enterButton placeholder="Search by country" onSearch={setQuery} />
            <Select value={filter} onChange={setFilter}>
              <Select.Option value="cases">Cases</Select.Option>
              <Select.Option value="todayCases">Cases today</Select.Option>
              <Select.Option value="deaths">Deaths</Select.Option>
              <Select.Option value="todayDeaths">Deaths today</Select.Option>
              <Select.Option value="recovered">Recovered</Select.Option>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="casesPerOneMillion">Cases per one million</Select.Option>
              <Select.Option value="critical">Critical</Select.Option>
            </Select>
          </Actions>,
        ]}
        title="COVID-19"
      />
      <Content>
        {error && <span>Error</span>}
        {loading &&
          Array(10)
            .fill(true)
            .map((_, index) => (
              <Box key={index}>
                <Skeleton active loading />
              </Box>
            ))}
        {results
          .map(({country, cases, todayCases, deaths, todayDeaths, recovered, active, casesPerOneMillion, critical}) => (
            <>
              <Typography.Title level={4}>
                <Badge status={cases > 1000 ? "error" : cases > 100 ? "warning" : "success"} />
                <span>{country}</span>
              </Typography.Title>
              <Box hoverable>
                <Grid>
                  <Statistic title="Cases" value={cases} />
                  <Statistic title="Cases today" value={todayCases} />
                  <Statistic title="Deaths" value={deaths} />
                  <Statistic title="Deaths today" value={todayDeaths} />
                  <Statistic title="Recovered" value={recovered} />
                  <Statistic title="Active" value={active} />
                  <Statistic title="Cases per one million" value={casesPerOneMillion} />
                  <Statistic title="Critical" value={critical} />
                </Grid>
              </Box>
            </>
          ))
          .slice(0, limit)}
        {results.length && limit < results.length && (
          <Button shape="round" size="large" type="primary" onClick={() => setLimit(limit + 10)}>
            Load more
          </Button>
        )}
      </Content>
      <Footer>
        Gonzalo Pozzo ©2020 - API from{" "}
        <a href="https://corona.lmao.ninja/countries" rel="noopener noreferrer" target="blank">
          LMAO Ninja
        </a>
      </Footer>
    </Layout>
  );
}
