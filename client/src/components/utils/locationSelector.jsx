import { FormControl, FormLabel, Input, InputGroup, List, ListItem } from '@chakra-ui/react'
import Downshift from 'downshift'
export default function comboBox({ isDisabled, value, places, handleInputValueChange, handleSelection }) {
    return (
        <Downshift
            onChange={handleSelection}
            itemToString={(item) => (item ? item.name : '')}
            onInputValueChange={handleInputValueChange}
            initialInputValue={value}
        >
            {({
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                isOpen,
                inputValue,
                highlightedIndex,
                selectedItem,
                getRootProps
            }) => (
                <FormControl {...getRootProps()} isDisabled={isDisabled} isReadOnly={isDisabled} >
                    <FormLabel {...getLabelProps()}>Enter You City</FormLabel>
                    <InputGroup {...getRootProps({}, { superRefError: true })}>
                        <Input {...getInputProps()} />
                    </InputGroup>
                    <List {...getMenuProps()} border={'1px solid lightgray'} >
                        {
                            isOpen ? (places.length == 0 ?
                                <ListItem>loading...</ListItem>
                                : places.filter(item => !inputValue || item?.name.includes(inputValue)).map((item, index) => (
                                    <ListItem
                                        {...getItemProps({
                                            key: `${index}${item.name}`,
                                            item,
                                            style: {
                                                backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                                            },
                                        })}
                                        p={2}
                                        borderRadius={5}
                                    >{item.name}</ListItem>
                                )))
                                : null}
                    </List>
                </FormControl>
            )}
        </Downshift>
    )
}
