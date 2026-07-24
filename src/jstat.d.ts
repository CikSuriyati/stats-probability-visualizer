declare module "jstat" {
  interface JStatDistribution {
    pdf(x: number, ...params: number[]): number;
    cdf(x: number, ...params: number[]): number;
    inv(p: number, ...params: number[]): number;
  }

  interface JStatStatic {
    normal: JStatDistribution;
    studentt: JStatDistribution;
    binomial: JStatDistribution;
    poisson: JStatDistribution;
  }

  export const jStat: JStatStatic;
}
