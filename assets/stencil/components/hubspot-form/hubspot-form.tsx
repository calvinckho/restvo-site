import { Component, Prop, Element, h, State, Host } from '@stencil/core';


interface fieldProps {
  label: string,
  placeholder: string,
  hidden: boolean,
  fieldType: "string" | "enumeration",
  name: string,
}

const HubspotFormGroups = ({fields}) => {
  return (
    <fieldset hidden={!fields.every(field => field.hidden === false)}>
      { fields.map(({label, hidden, fieldType, name, selectedOptions}) => [
        label ?
        <label hidden={hidden}>{label}</label> : '',
        <input required={!hidden} placeholder="Email" type={fieldType} hidden={hidden} name={name} value={selectedOptions[0]} class="hs-input"/>
      ]) }
    </fieldset>
  )
}

@Component({
  tag: 'hubspot-form',
  styleUrl: 'hubspot-form.scss',
  shadow: false
})
export class HubspotForm {
  @Prop() formId: string = 'default';
  @Prop() submitText: string;
  @Element() el: HTMLElement;
  @State() data = false;
  @State() emailInvalid: boolean = false;
  @State() emailSuccess: boolean = false;
  private wrapperId: string = "id-" + Math.random().toString(36).substring(2);
  private formFields: fieldProps[] = []
  private formGroups: any = [];
  
  private formEl: HTMLFormElement;

  // componentWillLoad() {
    // if (window['hbspt']) {
    //   this.createHubspotForm();
    //   return;
    // }
    
    // const script = document.createElement('script');
    // script.onload = () => {
    //   this.createHubspotForm();
    // };
    // script.onerror = this.loadBackupForm;
    // script.src = '//js.hsforms.net/forms/v2.js';

    // this.el.appendChild(script);
  // }

  createHubspotForm() {
    // window['hbspt'].forms.create({
    //   portalId: '3776657',
    //   formId: this.formId,
    //   target: `#${this.wrapperId}`,
    // });
  }

  componentWillLoad = async () => {
    const response = await fetch(`/api/v1/getform/${this.formId}`);
    const data = await response.json();

    this.formGroups = data.formFieldGroups;
    !this.submitText ? this.submitText = data.submitText : '';

    data.formFieldGroups.forEach(({fields}) => {
      fields.forEach(field => {
        this.formFields.push(field);
      })
    });
    
    this.data = true;
  }

  handleSubmit = async (e: UIEvent) => {
    e.preventDefault();
    const url: string = `https://api.hsforms.com/submissions/v3/integration/submit/3776657/${this.formId}`
    const cookie =  document.cookie.match(/(hubspotutk=).*?(?=;)/g);
    const fields = this.formFields.map(field => {
      return {
        "name": field.name,
        "value": this.formEl[`${field.name}`].value
      }
    });


    const context: { pageUri: string, pageName: string, hutk?: string} = {
      "pageUri": "https://ionicframework.com/ioniconf",
      "pageName": "Ioniconf 2020"
    }
    cookie ? context.hutk = cookie[0].split("hubspotutk=")[1] : '';

    const data = {
      "submittedAt": Date.now(),
      "fields": fields,
      "context": context
    }
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });

    if (response.status.toString().charAt(0) == '2'){
      this.emailSuccess = true;
    } else {
      this.emailInvalid = true;
    }
  }

  render() {
    if (!this.data) return;

    return (
      <Host id={this.wrapperId} class="hbspt-form">
        <form onSubmit={this.handleSubmit} ref={e => this.formEl = e} class="hs-form">
          { this.formGroups?.map(g => <HubspotFormGroups fields={g.fields}/>)}
          
          { this.emailSuccess ?
          <svg class="success" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 42c11.598 0 21-9.402 21-21S32.598 0 21 0 0 9.402 0 21s9.402 21 21 21z" fill="#D3F3DB"/>
            <path d="M13.87 20.97a1.75 1.75 0 00-2.54 2.408l2.54-2.407zm3.588 6.33l-1.27 1.204a1.75 1.75 0 002.54 0l-1.27-1.204zM30.67 15.904a1.75 1.75 0 00-2.54-2.408l2.54 2.408zm-19.34 7.474l4.858 5.126 2.54-2.408-4.858-5.125-2.54 2.407zm7.398 5.126l11.942-12.6-2.54-2.408-11.942 12.6 2.54 2.408z" fill="#43C465"/>
          </svg> :
          <button class="button" aria-label="submit email">{this.submitText}</button>}
        </form> 
      </Host>
    );
  }
}
