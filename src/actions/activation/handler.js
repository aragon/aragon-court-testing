module.exports = async function (court, [juror]) {
  await court.activate(juror)
}
