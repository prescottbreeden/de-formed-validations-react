# @De-Formed Validations

@De-Formed Validations is a react hook that offers a robust and unopinionated API to customize form and data validations. With only a handful of properties to learn, @de-formed maintains its own internal state with simple function calls so that you can design your architecture the way you want to.

## Why Use De-Formed?

1. Modular, Composable, and Scalable.
2. Unopinionated and Customizable.
3. Lightweight (1.6 kb gzipped).
3. Easy to use and test.

## Install
```
yarn add @de-formed/react-validations
```
```
npm i @de-formed/react-validations
```
## Basic Usage

### Step 1: Create a file to define your validations.
```ts
// PersonValidation.ts
import { useValidation } from '@de-formed/react-validations';

export const PersonValidation = () => {
  return useValidation<Person>({
    firstName: [
      {
        error: 'First Name is required.',
        validation: ({ firstName }) => firstName.length > 0,
      },
      {
        error: 'First Name cannot be longer than 20 characters.',
        validation: ({ firstName }) => firstName.length <= 20,
      },
    ],
    lastName: [
      {
        error: 'Last Name is required.',
        validation: ({ lastName }) => lastName.length > 0,
      },
      {
        error: 'Last Name cannot be longer than 20 characters.',
        validation: ({ lastName }) => lastName.length <= 20,
      },
      {
        error: 'Must be Ross if fist name is Bob.',
        validation: ({ firstName, lastName }) => {
          return firstName === 'Bob' ? lastName === 'Ross' : true;
        },
      },
    ],
  });
};
```

### Step 2: Plug into React Component
```tsx
// PersonForm.component.tsx
import React from 'react';
import { PersonValidation } from './PersonValidation';

export const PersonForm = ({ person, onChange }) => {
  const v = PersonValidation();

  const handleChange = v.validateOnChange(onChange, person);
  const handleBlur = v.validateOnBlur(person);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const canSubmit = v.validateAll(person);
    if (canSubmit) {
      // submit logic
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <input
          name="firstName"
          onBlur={handleBlur}
          onChange={handleChange}
          value={person.firstName}
        />
        {v.getError('firstName') && <p>{v.getError('firstName')}</p>}
      </div>
      <div>
        <label>Last Name</label>
        <input
          name="lastName"
          onBlur={handleBlur}
          onChange={handleChange}
          value={person.lastName}
        />
        {v.getError('lastName') && <p>{v.getError('lastName')}</p>}
      </div>
      <button>Submit</button>
    </form>
  );
};
```

***

## Schema Design for the FP folks
```ts
import { useValidation } from "@de-formed/react-validations";
import * as R from "ramda";
import { emailRegex } from "../constants";
import { PersonalInformation } from "../types";

const stringIsNotEmpty = R.compose(
  R.gt(R.__, 0),
  R.length,
  R.split(""),
  R.trim,
  R.ifElse(R.equals(undefined), R.defaultTo(""), R.identity)
);

export const PersonalInformationValidation = () => {
  return useValidation<PersonalInformation>({
    firstName: [
      {
        error: "First Name is required.",
        validation: R.compose(stringIsNotEmpty, R.prop("firstName")),
      },
    ],
    lastName: [
      {
        error: "Last Name is required.",
        validation: R.compose(stringIsNotEmpty, R.prop("lastName")),
      },
      {
        error: "Last Name must be Ross.",
        validation: R.ifElse(
          R.compose(
            R.equals("bob"),
            R.toLower,
            R.trim,
            R.defaultTo(""),
            R.prop<string, string>("firstName")
          ),
          R.compose(
            R.equals("ross"),
            R.toLower,
            R.trim,
            R.defaultTo(""),
            R.prop<string, string>("lastName")
          ),
          R.always(true)
        ),
      },
    ],
    phoneNumber: [
      {
        error: "Phone Number must be 10 digits.",
        validation: R.compose(
          R.ifElse(R.gt(R.__, 0), R.equals(10), R.always(true)),
          R.length,
          R.split(""),
          R.trim,
          R.defaultTo(""),
          R.prop<string, string>("phoneNumber")
        ),
      },
    ],
    email: [
      {
        error: "Email is required.",
        validation: R.compose(stringIsNotEmpty, R.prop("email")),
      },
      {
        error: "Must be a valid email.",
        validation: R.compose(R.test(emailRegex), R.prop("email")),
      },
    ],
  });
};
```

***

## Composable Forms
With validations abstracted to handle a single data layer, forms become composable once you seprate the form control from the form inputs. Feel free to read my blog with a link to an example code base: (link coming soon to a readme near you)

### Form Inputs
```js
// Panda.form.js
import * as R from "ramda";
import React, { useEffect } from "react";
import { FoodForm } from "../forms/Food.form";
import { NameForm } from "../forms/Name.form";
import { FriendForm } from "../forms/Friend.form";
import { DynamicForm } from "../common/DynamicForm.common";
import { replaceArrayItem, through } from "../utils/general";
import { maybe } from "../utils/maybe";
import { PandaValidations } from "../validations/Panda.validations";
import { emptyFriend } from "../models/friend.model";

export const PandaForm = ({
  onChange,
  data,
  disabled,
  submitFailed,
  overrideValidationState,
}) => {
  // --[ dependencies ]--------------------------------------------------------
  const v = PandaValidations();

  // --[ component logic ]-----------------------------------------------------
  // get :: string -> data[string]
  const get = R.prop(R.__, data);

  // updateModel[model] :: Partial<Panda> -> { Partial<Panda> }
  const updateModel = {
    name: R.assoc("name", R.__, data),
    food: R.assoc("food", R.__, data),
    friends: R.compose(
      R.assoc("friends", R.__, data),
      replaceArrayItem(get("friends"), "id")
  ),
  };

  // validateChange :: string -> Partial<Panda> -> void
  const validateChange = (name) =>
    R.converge(v.validateIfTrue, [R.always(name), R.mergeRight(data)]);

  // handleChange :: string -> Partial<Panda> -> void
  const handleChange = (name) =>
    through([
      validateChange(name),
      R.compose(onChange, updateModel[name]),
    ]);

  // addFriend :: () -> void
  const addFriend = (_) =>
    onChange({
      ...data,
      friends: [...get("friends"), emptyFriend()],
    });

  // removeFriend :: friend -> void
  const removeFriend = (friend) => {
    const friends = get("friends").filter((f) => f.id !== friend.id);
    onChange({ ...data, friends });
  };

  // --[ lifecycle ]-----------------------------------------------------------
  useEffect(() => {
    if (submitFailed) {
      v.validateAll(data);
      maybe(overrideValidationState).map(v.setValidationState);
    }
  }, [submitFailed, overrideValidationState, data]); // eslint-disable-line

  return (
    <>
      <fieldset>
        <legend>Panda.form.jsx</legend>
        <NameForm
          data={get("name")}
          disabled={disabled}
          onChange={handleChange("name")}
          submitFailed={submitFailed}
        />
        <FoodForm
          data={get("food")}
          disabled={disabled}
          onChange={handleChange("food")}
          submitFailed={submitFailed}
        />
        <h2>Add friends for your panda</h2>
        <DynamicForm
          addForm={addFriend}
          disabled={disabled}
          entity="Friend"
          form={FriendForm}
          items={get("friends")}
          formKey="id"
          onChange={handleChange("friends")}
          removeForm={removeFriend}
          submitFailed={submitFailed}
        />
      </fieldset>
    </>
  );
};
```
### Form Control
```js
// CreatePanda.component.js
import * as R from "ramda";
import React, { useState } from "react";
import { emptyPanda } from "../models/panda.model";
import { PandaValidations } from "../validations/Panda.validations";
import { useToggle } from "../hooks/useToggle.hook";
import { PandaForm } from "../forms/Panda.form";
import { ValidationErrors } from "../common/ValidationErrors.common";
import { through, trace } from "../utils/general";
import { handleApiResponse, request } from "../utils/request";

export const CreatePanda = ({ disabled }) => {
  // --[ dependencies ]--------------------------------------------------------
  const v = PandaValidations();

  // --[ local state ]---------------------------------------------------------
  const [panda, setPanda] = useState(emptyPanda());
  const [
    hasValidationErrors,
    activateValidationErrors,
    deactivateValidationErrors,
  ] = useToggle(false);

  // --[ component logic ]-----------------------------------------------------
  // handleChange :: Panda -> void
  const handleChange = through([
    v.validateAllIfTrue,
    setPanda
  ]);

  // handleSubmitResponse :: API JSON -> void
  const handleSubmitResponse = handleApiResponse(v, activateValidationErrors);

  // dispatchPayload :: Panda -> void
  const dispatchPayload = async (payload) => {
    request('panda', "POST", payload)
      .then((res) => res.json())
      .then(handleSubmitResponse)
      .catch(trace("whoopsies"));
  };

  // onFailure :: Panda -> void
  const onFailure = through([
    trace("rendering front-end errors"),
    activateValidationErrors,
  ]);

  // onSuccess :: Panda -> void
  const onSuccess = through([
    dispatchPayload,
    deactivateValidationErrors
  ]);

  // handleSubmit :: Panda -> fn(Panda)
  const handleSubmit = R.cond([
    [v.validateAll, onSuccess],
    [R.always(true), onFailure],
  ]);

  return (
    <section>
      <fieldset>
        <legend>CreatePanda.component.jsx</legend>
        <PandaForm
          data={panda}
          disabled={disabled}
          onChange={handleChange}
          submitFailed={hasValidationErrors}
        />
        <button disabled={disabled} onClick={() => handleSubmit(panda)}>
          Submit
        </button>
        <ValidationErrors {...v} />
      </fieldset>
    </section>
  );
};
```

***

## A Different, Functional, Event Driven Approach
One of the biggest differences you will notice with @De-formed is it has no property or state for the concept of "touched". The problem with touched is most concisely put in that it obstructs event customization around validations. If you are building validations around the user's behavior, it also happens to be a completely useless property. The documentation for @De-formed guides you through setting up validations that only remove errors on change events but validate on blur and submit; however, you can customize the behavior any way you wish.

Importantly, all validations are de-coupled from your form architecture allowing them to be executed, reused, and composed together in any context necessary. Ditch the form tag, define as many functions as you want in your schema with as many nested schemas as you like and then compose them all into a single form control and execute them on whichever events you choose. This provides you with a function-based, modular approach to design validation patterns that meet your requirements without the hassle of managing the validation data yourself.

## Documentation

Check out the [documentation](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Docs).

## Examples

More [examples](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Examples) and CodeSandboxes.

## Coverage
![coverage](https://github.com/prescottbreeden/de-formed-validations-react/blob/master/coverage.png?raw=true)

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
