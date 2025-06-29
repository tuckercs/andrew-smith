import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { useForm } from '@formspree/react'
import Input from '@components/form/input'

// sample form input format:
// const contactForm = [
//   {
//     name: 'firstName',
//     placeholder: 'First Name',
//     type: 'text',
//     required: true,
//     cols: [
//       mobile: 'full'
//       desktop: 'half'
//     ],
//   },
//   {
//     name: 'lastName',
//     title: 'Last Name',
//     placeholder: 'Last Name',
//     type: 'text',
//     required: true,
//     cols: [
//       mobile: 'full'
//       desktop: 'half'
//     ],
//   }
// ]

// TODO: update component to match formatting and integrate Sanity
// reference time and tide input functions

const Form = () => {
  const [form, setForm] = useState({})
  const [disabled, setDisabled] = useState(true)
  const [state, handleSubmit] = useForm(
    process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
  )

  useEffect(() => {
    if (
      form.firstName &&
      form.lastName &&
      form.email &&
      form.privacySignoff &&
      form.marketingSignoff
    ) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [form])

  const loadingState = state?.submitting
  const successState = state?.succeeded

  return (
    <section id="section-form" className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-6 gap-20 text-14 leading-130">
          <div className="col-span-full">GET IN TOUCH</div>
          <div className="col-span-3">
            <Input
              label="First Name*"
              name="firstName"
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
              value={form?.firstName ? form.firstName : ''}
            />
          </div>
          <div className="col-span-3">
            <Input
              label="Last Name*"
              name="lastName"
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
              value={form?.lastName ? form.lastName : ''}
            />
          </div>
          <div className="col-span-3">
            <Input
              label="Company Name"
              name="companyName"
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
              value={form?.companyName ? form.companyName : ''}
            />
          </div>
          <div className="col-span-3">
            <Input
              label="Email*"
              name="email"
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
              value={form?.email ? form.email : ''}
            />
          </div>
          <div className="col-span-3">
            <Input
              label="Phone Number"
              name="phoneNumber"
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
              value={form?.phoneNumber ? form.phoneNumber : ''}
            />
          </div>
          <div className="col-span-3">
            <Input
              label="Location"
              name="location"
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
              value={form?.location ? form.location : ''}
            />
          </div>
          <div className="col-span-full">
            <Input
              label="What are you interested in?"
              name="projectInterest"
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
              value={form?.projectInterest ? form.projectInterest : ''}
            />
          </div>
          <div className="col-span-full">
            <Input
              label="Tell us more about what you're looking for"
              name="moreDetail"
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
              value={form?.moreDetail ? form.moreDetail : ''}
            />
          </div>
          <div className="col-span-full">
            <Input
              label="What is your timeline?"
              name="projectTimeline"
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
              value={form?.timeline ? form.timeline : ''}
            />
          </div>
          <div className="col-span-full text-12">
            <label className="container">
              I agree to receive Marketing communications from TAIT.*
              <input
                name="marketingSignoff"
                type="checkbox"
                onChange={(event) =>
                  setForm({
                    ...form,
                    [event.target.name]: event.target.checked,
                  })
                }
              />
              <span className="checkmark" />
            </label>

            <label className="container">
              I agree to allow TAIT to store and process my personal data.*
              <input
                name="privacySignoff"
                type="checkbox"
                onChange={(event) =>
                  setForm({
                    ...form,
                    [event.target.name]: event.target.checked,
                  })
                }
              />
              <span className="checkmark" />
            </label>
          </div>
          <div className="col-span-full flex">
            {state.result?.kind === 'success' ? (
              <h4>Thank you for your submission!</h4>
            ) : (
              <button
                disabled={disabled || state.submitting}
                type="submit"
                className={cx('content-button alt flex', {
                  'is-disabled': disabled,
                })}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  )
}

export default Form
