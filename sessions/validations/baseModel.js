module.exports = (_baseline) => {
  const baseline = `${_baseline}.*.` || '';
  return {
    [`${baseline}name`]: {
      in: ['body'],
    },
    [`${baseline}description`]: {
      in: ['body'],
    },
  };
};
