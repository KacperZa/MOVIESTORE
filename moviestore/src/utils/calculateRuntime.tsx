const CalculateRuntime = (runtime: number | undefined) => {
  if(!runtime) return {hoursRuntime: 0, minutesRuntime: 0}
  const hoursRuntime = Math.floor(runtime / 60)
  const minutesRuntime = runtime % 60
  return { hoursRuntime, minutesRuntime }
}
export default CalculateRuntime