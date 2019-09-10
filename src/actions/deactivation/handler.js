module.exports = async function (court, [juror]) {
  await court.deactivate(juror)
}
