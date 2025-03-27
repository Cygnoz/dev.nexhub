// Path: tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        primary_main: '#FFFFFF',
        primary_button:'#0099F8',
        primary_hover: '#0C8CDB',
        primary_active: '#0C8CDB',
        primary_disabled: '#9EA9BB',

        secondary_main: '#FEFDFA',
        secondary_hover: '#FDF8F0',
        secondary_active: '#F7E7CE',
        secondary_disabled: '#FDF8F0',

        tertiary_main: '#FCFFED',
        tertiary_hover: '#E3E6D5',
        tertiary_active: '#CACCBE',
        tertiary_disabled: '#FEFFF9',

        fourthiary_main: '#2C353B',
        fourthiary_hover: '#232A2F',
        fourthiary_active: '#232A2F',
        fourthiary_disabled: '#BEC0C2',

        maroon: '#820000',
        lightBeige: '#F7E7CE',
        iconhover: ' #530015',
        customColor1: "rgb(243,237,217)",
        customColor2: "rgb(214,238,214)",
        bgColor: "rgb(243,237,217)",
        cardBg: "rgba(247, 231, 206, 1)",
        cardBorder: "rgba(0, 153, 248, 1)",
        organizationBg: "rgb(243,230,230)",
        textColor: "rgb(48,63,88,1)",
        dropdownText: "rgba(75, 92, 121, 1)",
        softBeige: "rgb(247,231,206)",
        gray: "rgb(88,89,83)",
        lightPink: "rgb(250,242,240)",
        darkRed: "rgb(130,0,0)",
        lightRose: "rgb(254,251,248)",
        WhiteIce: "#E3E6D5",
        CreamBg: "rgba(253, 248, 240, 1)",
        labelColor: "#495160",
        inputBorder: "rgba(206, 206, 206, 1)",
        outlineButton: "rgba(0, 153, 248, 1)",
        tableBorder: "#EAECF0",
        hr: "rgba(204, 204, 204, 1)",
        dropdownBorder: "#DCDEE2",
        BgSubhead: "#E3E6D5",
        loremcolor: "#8F99A9",
        checkBox:"#97998E",
        cuscolumnbg: "#F3F3F3",
        borderRight:"#A3A9B3",
        pdftext:"#0A2540",
        pdfbg:"#F9F9FA",
        backButton:"#F6F6F6",
        blk:"#0B1320",
        billingBorder:"#DADBDD",
        membershipText:"#FCF8ED",
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        '9999': '9999',
      },
      placeholderColor: {
        labelColor: "#495160",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      })
    }
  ],
}
