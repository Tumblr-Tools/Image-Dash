export default (strings, ...keys) => (
  data => (
    strings.reduce((accumulator, currentValue, currentIndex) => (
      accumulator + data[keys[currentIndex - 1]] + currentValue
    ))
  )
);
