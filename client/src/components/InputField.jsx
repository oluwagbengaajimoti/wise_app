import React from "react";
import PropTypes from "prop-types";

const InputField = React.forwardRef((props, ref) => {
  const { type, name, id, classes, placeholder, onChange, value } = props;

  const defaultClasses =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  const inputClasses = classes ? classes : defaultClasses;

  return (
    <input
      type={type}
      name={name}
      id={id}
      className={inputClasses}
      placeholder={placeholder}
      onChange={onChange}
      ref={ref}
      value={value}
    />
  );
});

InputField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  classes: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

InputField.displayName = "InputField";

export default InputField;
