import PropTypes from "prop-types";

const Label = ({ htmlFor, Lavel_name, classes }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={
        classes
          ? classes
          : "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      }
    >
      {Lavel_name}
    </label>
  );
};

Label.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  Lavel_name: PropTypes.string.isRequired,
  classes: PropTypes.string,
};

export default Label;
