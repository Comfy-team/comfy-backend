module.exports.getDataOfPage = (data, page = 1, dataPerPage = 10) => {
  const totalPages = Math.ceil(data.length / dataPerPage);
  const pageData = data.slice(
    (page - 1) * dataPerPage,
    (page - 1) * dataPerPage + dataPerPage
  );
  return { pageData, totalPages };
};
