export const config = {
  type: 'map',
  nested: {
    name: {
      type: 'string',
      validate: {
        required: true
      },
      options: {
        message: 'This is some dummy text here.'
      },
    },
    food: {
      type: 'array',
      display: 'name',
      options: {
        message: 'You\'re favorite food!'
      },
      nested: {
        type: 'map',
        nested: {
          name: {
            type: 'string',
            validate: {
              required: true,
            }
          },
          isFavorite: {
            type: 'bool',
            validate: {
              required: true
            }
          },
          ingredients: {
            type: 'array',
            nested: {
              type: 'bool'
            },
            validate: {
              required: true
            }
          }
        }
      }
    },
    car: {
      type: 'map',
      nested: {
        make: {
          type: 'string',
          validate: {
            required: true,
          }
        },
        model: {
          type: 'string',
          validate: {
            required: true,
          }
        },
        owners: {
          type: 'array',
          nested: {
            type: 'string',
            validate: {
              required: true
            }
          },
          validate: {
            required: true
          }
        }
      },
    },
    color: {
      type: 'select',
      choices: [
        'red',
        'orange',
        'green',
        'blue'
      ]
    },
    date: {
      type: 'date',
      validate: {
        required: true
      }
    },
    profile: {
      type: 'string',
      options: {
        multiline: true,
        rows: 10,
        rowsMax: 10,
        markdown: true,
        viewMarkdown: true
      },
      validate: {
        required: true
      }
    },
    quantity: {
      type: 'number',
      validate: {
        required: true
      }
    },
    image: {
      type: 'url'
    }
  }
}

const food = [];
for (let i = 0; i < 50; i++) {
  food.push({
    id: i,
    name: `item-${i}`,
    isFavorite: false
  });
}

export const initialValues = {
  name: 'axa',
  car: {
    make: 'toyota',
  },
  food: [
    { name: 'apple', index: 0 }
  ]
}

export const arrayConfig = {
  type: 'array',
  nested: {
    type: 'string'
  },
  validate: {
    required: true
  }
}

export const arrayInitialValues = [
]