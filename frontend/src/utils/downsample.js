export function downsample(data, step) {
  return data.filter((_, index) => index % step === 0);
}
