class ContactPicker {
  constructor() {
    this.supported = 'contacts' in navigator;

    this.propertiesRequired = ['name', 'tel']
    this.options = {}

    this.notSupportedSection = document.getElementById('not-supported-section')
    this.contactPickerSection = document.getElementById('contact-picker-section')
    this.contactPickerButton = document.getElementById('contact-picker-button')

    this.init();
  }

  init() {
    if(!this.supported) {
      this.notSupportedSection.classList.remove('hidden');
      return;
    }
    
    this.contactPickerSection.classList.remove('hidden')

    this.propertiesRequired.map((prop) => {
      document.getElementById(`checkbox-${prop}`).setAttribute('checked', true);
    });

    this.bindOptions()
    this.bindContactAccess()
    this.updateSupportedProps()
  }

  async updateSupportedProps() {
    const props = ['address', 'email', 'icon', 'name', 'tel' ]
    const supportedProperties = await navigator.contacts.getProperties();
    props.map((prop) => {
      const id = document.getElementById(`prop-supported-${prop}`)
      if(supportedProperties.includes(prop)) {
        id.innerText = id.innerText + ' Y'
      } else {
        id.innerText = id.innerText + ' N'
      }
    })
  }

  bindOptions() {
    [...(document.getElementsByTagName('input'))].forEach(element => {
      element.addEventListener('change', (event)=> {
        if(event.target.id.startsWith('checkbox')) {
          if(event.target.checked) {
            this.propertiesRequired.push(event.target.name)
          } else {
            this.propertiesRequired = this.propertiesRequired.filter((prop) => prop !== event.target.name)
          }
        }
      })
    });

    document.getElementById('multiple').addEventListener('change', (event) => {
      this.options = {
        ...this.options,
        multiple: event.target.checked
      }
    })
  }

  bindContactAccess() {
    this.contactPickerButton.addEventListener('click', async () => {
      try {
        const contacts = await navigator.contacts.select(this.propertiesRequired, this.options);
        document.getElementById('output').innerHTML = JSON.stringify(contacts);
      } catch (ex) {
        document.getElementById('output').innerHTML = ex;
      }
    })
  }
}

var cp = new ContactPicker()