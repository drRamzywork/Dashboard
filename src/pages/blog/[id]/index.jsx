import React from 'react'
import axios from 'axios';

const Blog = ({ blog }) => {

  return (
    <h1>Blog</h1>
  )
}

export default Blog

export async function getServerSideProps(context) {
  const id = context.query.id;

  const data = JSON.stringify({
    "dataSource": "Cluster0",
    "database": "dashboard-db",
    "collection": "blogs",
    "filter": {
      "_id": {
        "$oid": id
      }
    }
  });

  const config = {
    method: 'post',
    url: 'https://data.mongodb-api.com/app/data-yhygn/endpoint/data/v1/action/findOne',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': "Mmg9Q0QiZkSIpthlGX1zIYY7GS2NHj7iEtz16skuqlbCIJGDDIUDmyw1xLLmAGkL", // Use an environment variable for the API key
      'Accept': 'application/json'
    },
    data: data
  };

  try {
    const response = await axios.request(config);

    return { props: { blog: response.data.document } };

  } catch (error) {
    console.error(error);

    return { props: { blog: {} } };
  }
}
