const buildEmberUrl = (path, params) => {
  const baseUrl = "https://api.ember-energy.org";
  const url = new URL(`${baseUrl}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const fetchYearlyElectricityGeneration = async ({
  entityCode,
  startDate,
  endDate
}) => {
  if (!process.env.EMBER_API_KEY) {
    throw new Error("EMBER_API_KEY is not defined");
  }

  const url = buildEmberUrl("/v1/electricity-generation/yearly", {
    entity_code: entityCode,
    is_aggregate_series: "false",
    start_date: startDate,
    end_date: endDate,
    api_key: process.env.EMBER_API_KEY
  });

  const response = await fetch(url);

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Ember API request failed with status ${response.status}: ${responseText}`
    );
  }

  return response.json();
};

module.exports = {
  fetchYearlyElectricityGeneration
};