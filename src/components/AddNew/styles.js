export const customDropdownStyles = {
  control: (provided) => {
    return {
      ...provided,
      borderColor: '#e3e5e9 !important',
      boxShadow: 'none !important',
    };
  },
  menu: (provided) => {
    return {
      ...provided,
      zIndex: 2,
    };
  },
  menuList: (provided) => {
    return {
      ...provided,
      maxHeight: 'auto',
    };
  },
  singleValue: (provided) => {
    return {
      ...provided,
      fontFamily: 'Roboto',
      fontSize: '14px',
      lineHeight: '20px',
      color: '#1B2A3D',
    };
  },
  placeholder: (provided) => {
    return {
      ...provided,
      fontFamily: 'Roboto',
      fontSize: '14px',
      lineHeight: '20px',
      color: '#8E97A3',
    };
  },
  option: (provided, state) => {
    return {
      ...provided,
      fontFamily: 'Roboto',
      cursor: 'pointer',
      fontSize: state.isDisabled ? '12px' : '14px',
      lineHeight: state.isDisabled ? '16px' : '20px',
      color: state.isDisabled
        ? '#8E97A3'
        : state.isSelected
        ? '#fff'
        : '#1B2A3D',
    };
  },
};

export const areaDropdownStyles = {
  ...customDropdownStyles,
  singleValue: (provided, state) => {
    return {
      ...provided,
      fontFamily: 'Roboto',
      fontSize: '14px',
      lineHeight: '20px',
      padding: '2px 4px',
      borderRadius: '4px',
      color: `${state.data.color} !important`,
      backgroundColor: `${state.data.bgColor} !important`,
    };
  },
  option: (provided, state) => {
    return {
      ...provided,
      fontFamily: 'Roboto',
      fontSize: '14px',
      lineHeight: '20px',
      color: `${state.data.color} !important`,
      backgroundColor: `${state.data.bgColor} !important`,
      width: 'max-content',
      padding: '2px 4px',
      margin: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
    };
  },
};
