import Select from 'react-select'

function SelectDropdown(props) {
    return (
      <div>
        <Select options={props.selectOptions} /> 
      </div>
}