import { noaa_parse_27_day_outlook } from '../lib/auroras';

test('Parse NOAA Outlook', () => {
  const outlook = `:Product: 27-day Space Weather Outlook Table 27DO.txt
:Issued: 2025 May 05 0116 UTC
# Prepared by the US Dept. of Commerce, NOAA, Space Weather Prediction Center
# Product description and SWPC contact on the Web
# https://www.swpc.noaa.gov/content/subscription-services
#
#      27-day Space Weather Outlook Table
#                Issued 2025-05-05
#
#   UTC      Radio Flux   Planetary   Largest
#  Date       10.7 cm      A Index    Kp Index
2025 May 05     160          18          5
2025 May 06     160          12          4
`
  const parsed = noaa_parse_27_day_outlook(outlook);
  expect(parsed).toEqual([
    {date: new Date("2025-05-05"), kindex: 5},
    {date: new Date("2025-05-06"), kindex: 4},
  ]);
})
