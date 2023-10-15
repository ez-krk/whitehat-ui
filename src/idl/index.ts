export type IDL = {
  version: '0.1.0'
  name: 'whitehat'
  instructions: [
    {
      name: 'initialize'
      accounts: [
        {
          name: 'admin'
          isMut: true
          isSigner: true
        },
        {
          name: 'auth'
          isMut: false
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'auth'
              }
            ]
          }
        },
        {
          name: 'vault'
          isMut: false
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'vault'
              }
            ]
          }
        },
        {
          name: 'analytics'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'analytics'
              }
            ]
          }
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'registerProtocol'
      accounts: [
        {
          name: 'owner'
          isMut: true
          isSigner: true
        },
        {
          name: 'encryption'
          isMut: false
          isSigner: false
        },
        {
          name: 'protocol'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'protocol'
              },
              {
                kind: 'account'
                type: 'publicKey'
                path: 'owner'
              }
            ]
          }
        },
        {
          name: 'auth'
          isMut: false
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'auth'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol'
              }
            ]
          }
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'vault'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol'
              }
            ]
          }
        },
        {
          name: 'analytics'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'analytics'
              }
            ]
          }
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'name'
          type: 'string'
        },
        {
          name: 'percent'
          type: 'u64'
        }
      ]
    },
    {
      name: 'reportVulnerability'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'payout'
          isMut: false
          isSigner: false
        },
        {
          name: 'protocol'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'protocol'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol.owner'
              }
            ]
          }
        },
        {
          name: 'vulnerability'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'vulnerability'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol'
              },
              {
                kind: 'arg'
                type: 'u64'
                path: 'id'
              },
              {
                kind: 'arg'
                type: 'u64'
                path: 'seed'
              }
            ]
          }
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'message'
          type: 'bytes'
        },
        {
          name: 'id'
          type: 'u64'
        },
        {
          name: 'seed'
          type: 'u64'
        }
      ]
    },
    {
      name: 'approveVulnerability'
      accounts: [
        {
          name: 'owner'
          isMut: true
          isSigner: true
        },
        {
          name: 'protocol'
          isMut: false
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'protocol'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol.owner'
              }
            ]
          }
          relations: ['owner']
        },
        {
          name: 'vulnerability'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'vulnerability'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol'
              },
              {
                kind: 'account'
                type: 'u64'
                account: 'Vulnerability'
                path: 'vulnerability.id'
              },
              {
                kind: 'account'
                type: 'u64'
                account: 'Vulnerability'
                path: 'vulnerability.seed'
              }
            ]
          }
          relations: ['protocol']
        },
        {
          name: 'analytics'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'analytics'
              }
            ]
          }
        }
      ]
      args: []
    },
    {
      name: 'depositSolHack'
      accounts: [
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'payout'
          isMut: false
          isSigner: false
        },
        {
          name: 'protocol'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'protocol'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol.owner'
              }
            ]
          }
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'vault'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol'
              }
            ]
          }
        },
        {
          name: 'vulnerability'
          isMut: false
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'vulnerability'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol'
              },
              {
                kind: 'account'
                type: 'u64'
                account: 'Vulnerability'
                path: 'vulnerability.id'
              },
              {
                kind: 'account'
                type: 'u64'
                account: 'Vulnerability'
                path: 'vulnerability.seed'
              }
            ]
          }
          relations: ['payout']
        },
        {
          name: 'hack'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'hack'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol'
              },
              {
                kind: 'arg'
                type: 'u64'
                path: 'amount'
              }
            ]
          }
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'amount'
          type: 'u64'
        }
      ]
    },
    {
      name: 'approveSolHack'
      accounts: [
        {
          name: 'owner'
          isMut: true
          isSigner: true
        },
        {
          name: 'auth'
          isMut: false
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'auth'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol'
              }
            ]
          }
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'vault'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol'
              }
            ]
          }
        },
        {
          name: 'fees'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'vault'
              }
            ]
          }
        },
        {
          name: 'protocol'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'protocol'
              },
              {
                kind: 'account'
                type: 'publicKey'
                path: 'owner'
              }
            ]
          }
          relations: ['owner']
        },
        {
          name: 'payout'
          isMut: true
          isSigner: false
        },
        {
          name: 'hack'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'hack'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol'
              },
              {
                kind: 'account'
                type: 'u64'
                account: 'SolHack'
                path: 'hack.amount'
              }
            ]
          }
          relations: ['protocol', 'payout']
        },
        {
          name: 'analytics'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'analytics'
              }
            ]
          }
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'deleteProtocol'
      accounts: [
        {
          name: 'admin'
          isMut: true
          isSigner: true
        },
        {
          name: 'protocol'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'protocol'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol.owner'
              }
            ]
          }
        },
        {
          name: 'analytics'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'analytics'
              }
            ]
          }
          relations: ['admin']
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'deleteVulnerability'
      accounts: [
        {
          name: 'admin'
          isMut: true
          isSigner: true
        },
        {
          name: 'protocol'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'protocol'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol.owner'
              }
            ]
          }
        },
        {
          name: 'vulnerability'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'vulnerability'
              },
              {
                kind: 'account'
                type: 'publicKey'
                account: 'Protocol'
                path: 'protocol'
              },
              {
                kind: 'account'
                type: 'u64'
                account: 'Vulnerability'
                path: 'vulnerability.id'
              },
              {
                kind: 'account'
                type: 'u64'
                account: 'Vulnerability'
                path: 'vulnerability.seed'
              }
            ]
          }
          relations: ['protocol']
        },
        {
          name: 'analytics'
          isMut: true
          isSigner: false
          pda: {
            seeds: [
              {
                kind: 'const'
                type: 'string'
                value: 'analytics'
              }
            ]
          }
          relations: ['admin']
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    }
  ]
  accounts: [
    {
      name: 'Analytics'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'admin'
            type: 'publicKey'
          },
          {
            name: 'protocols'
            type: 'u64'
          },
          {
            name: 'vulnerabilities'
            type: 'u64'
          },
          {
            name: 'hacks'
            type: 'u64'
          },
          {
            name: 'solRecovered'
            type: 'u64'
          },
          {
            name: 'solPaid'
            type: 'u64'
          },
          {
            name: 'fees'
            type: 'u64'
          },
          {
            name: 'createdAt'
            type: 'i64'
          },
          {
            name: 'authBump'
            type: 'u8'
          },
          {
            name: 'vaultBump'
            type: 'u8'
          },
          {
            name: 'stateBump'
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'Protocol'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'owner'
            type: 'publicKey'
          },
          {
            name: 'encryption'
            type: 'publicKey'
          },
          {
            name: 'vault'
            type: 'publicKey'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'percent'
            type: 'u64'
          },
          {
            name: 'paid'
            type: 'u64'
          },
          {
            name: 'vulnerabilities'
            type: 'u64'
          },
          {
            name: 'hacks'
            type: 'u64'
          },
          {
            name: 'createdAt'
            type: 'i64'
          },
          {
            name: 'authBump'
            type: 'u8'
          },
          {
            name: 'vaultBump'
            type: 'u8'
          },
          {
            name: 'stateBump'
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'SolHack'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'protocol'
            type: 'publicKey'
          },
          {
            name: 'payout'
            type: 'publicKey'
          },
          {
            name: 'reviewed'
            type: 'bool'
          },
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'createdAt'
            type: 'i64'
          },
          {
            name: 'bump'
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'Vulnerability'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'protocol'
            type: 'publicKey'
          },
          {
            name: 'reviewed'
            type: 'bool'
          },
          {
            name: 'id'
            type: 'u64'
          },
          {
            name: 'payout'
            type: 'publicKey'
          },
          {
            name: 'message'
            type: 'bytes'
          },
          {
            name: 'createdAt'
            type: 'i64'
          },
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'seed'
            type: 'u64'
          }
        ]
      }
    }
  ]
  errors: [
    {
      code: 6000
      name: 'ProtocolNameEmpty'
      msg: 'Protocol Name Empty.'
    },
    {
      code: 6001
      name: 'ProtocolNameTooLong'
      msg: 'Protocol Name Too Long, 50 Characters Maximum.'
    },
    {
      code: 6002
      name: 'HackerNameEmpty'
      msg: 'Hacker Name Empty.'
    },
    {
      code: 6003
      name: 'HackerNameTooLong'
      msg: 'Hacker Name Too Long, 50 Characters Maximum.'
    },
    {
      code: 6004
      name: 'GPGKeyEmpty'
      msg: 'GPG Key Empty.'
    },
    {
      code: 6005
      name: 'GPGKeyTooSmall'
      msg: 'GPG Key Too Small, 2048 Characters Min.'
    },
    {
      code: 6006
      name: 'GPGKeyTooBig'
      msg: 'GPG Key Too Big, 4096 characters maximum.'
    },
    {
      code: 6007
      name: 'MessageEmpty'
      msg: 'Message empty.'
    }
  ]
  metadata: {
    address: 'HATNBZtwk8uLUZeSuYK8QYwWzk1kT5didcGFs9a6GtTW'
  }
}

export const IDL: IDL = {
  version: '0.1.0',
  name: 'whitehat',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'auth',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'auth',
              },
            ],
          },
        },
        {
          name: 'vault',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'vault',
              },
            ],
          },
        },
        {
          name: 'analytics',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'analytics',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'registerProtocol',
      accounts: [
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'encryption',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'protocol',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'protocol',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'owner',
              },
            ],
          },
        },
        {
          name: 'auth',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'auth',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol',
              },
            ],
          },
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'vault',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol',
              },
            ],
          },
        },
        {
          name: 'analytics',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'analytics',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'percent',
          type: 'u64',
        },
      ],
    },
    {
      name: 'reportVulnerability',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'payout',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'protocol',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'protocol',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol.owner',
              },
            ],
          },
        },
        {
          name: 'vulnerability',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'vulnerability',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol',
              },
              {
                kind: 'arg',
                type: 'u64',
                path: 'id',
              },
              {
                kind: 'arg',
                type: 'u64',
                path: 'seed',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'message',
          type: 'bytes',
        },
        {
          name: 'id',
          type: 'u64',
        },
        {
          name: 'seed',
          type: 'u64',
        },
      ],
    },
    {
      name: 'approveVulnerability',
      accounts: [
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'protocol',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'protocol',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol.owner',
              },
            ],
          },
          relations: ['owner'],
        },
        {
          name: 'vulnerability',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'vulnerability',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'Vulnerability',
                path: 'vulnerability.id',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'Vulnerability',
                path: 'vulnerability.seed',
              },
            ],
          },
          relations: ['protocol'],
        },
        {
          name: 'analytics',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'analytics',
              },
            ],
          },
        },
      ],
      args: [],
    },
    {
      name: 'depositSolHack',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'payout',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'protocol',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'protocol',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol.owner',
              },
            ],
          },
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'vault',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol',
              },
            ],
          },
        },
        {
          name: 'vulnerability',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'vulnerability',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'Vulnerability',
                path: 'vulnerability.id',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'Vulnerability',
                path: 'vulnerability.seed',
              },
            ],
          },
          relations: ['payout'],
        },
        {
          name: 'hack',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'hack',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol',
              },
              {
                kind: 'arg',
                type: 'u64',
                path: 'amount',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'approveSolHack',
      accounts: [
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'auth',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'auth',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol',
              },
            ],
          },
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'vault',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol',
              },
            ],
          },
        },
        {
          name: 'fees',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'vault',
              },
            ],
          },
        },
        {
          name: 'protocol',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'protocol',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'owner',
              },
            ],
          },
          relations: ['owner'],
        },
        {
          name: 'payout',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'hack',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'hack',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'SolHack',
                path: 'hack.amount',
              },
            ],
          },
          relations: ['protocol', 'payout'],
        },
        {
          name: 'analytics',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'analytics',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'deleteProtocol',
      accounts: [
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'protocol',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'protocol',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol.owner',
              },
            ],
          },
        },
        {
          name: 'analytics',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'analytics',
              },
            ],
          },
          relations: ['admin'],
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'deleteVulnerability',
      accounts: [
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'protocol',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'protocol',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol.owner',
              },
            ],
          },
        },
        {
          name: 'vulnerability',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'vulnerability',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Protocol',
                path: 'protocol',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'Vulnerability',
                path: 'vulnerability.id',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'Vulnerability',
                path: 'vulnerability.seed',
              },
            ],
          },
          relations: ['protocol'],
        },
        {
          name: 'analytics',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'analytics',
              },
            ],
          },
          relations: ['admin'],
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'Analytics',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'admin',
            type: 'publicKey',
          },
          {
            name: 'protocols',
            type: 'u64',
          },
          {
            name: 'vulnerabilities',
            type: 'u64',
          },
          {
            name: 'hacks',
            type: 'u64',
          },
          {
            name: 'solRecovered',
            type: 'u64',
          },
          {
            name: 'solPaid',
            type: 'u64',
          },
          {
            name: 'fees',
            type: 'u64',
          },
          {
            name: 'createdAt',
            type: 'i64',
          },
          {
            name: 'authBump',
            type: 'u8',
          },
          {
            name: 'vaultBump',
            type: 'u8',
          },
          {
            name: 'stateBump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'Protocol',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'encryption',
            type: 'publicKey',
          },
          {
            name: 'vault',
            type: 'publicKey',
          },
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'percent',
            type: 'u64',
          },
          {
            name: 'paid',
            type: 'u64',
          },
          {
            name: 'vulnerabilities',
            type: 'u64',
          },
          {
            name: 'hacks',
            type: 'u64',
          },
          {
            name: 'createdAt',
            type: 'i64',
          },
          {
            name: 'authBump',
            type: 'u8',
          },
          {
            name: 'vaultBump',
            type: 'u8',
          },
          {
            name: 'stateBump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'SolHack',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'protocol',
            type: 'publicKey',
          },
          {
            name: 'payout',
            type: 'publicKey',
          },
          {
            name: 'reviewed',
            type: 'bool',
          },
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'createdAt',
            type: 'i64',
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'Vulnerability',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'protocol',
            type: 'publicKey',
          },
          {
            name: 'reviewed',
            type: 'bool',
          },
          {
            name: 'id',
            type: 'u64',
          },
          {
            name: 'payout',
            type: 'publicKey',
          },
          {
            name: 'message',
            type: 'bytes',
          },
          {
            name: 'createdAt',
            type: 'i64',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'seed',
            type: 'u64',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'ProtocolNameEmpty',
      msg: 'Protocol Name Empty.',
    },
    {
      code: 6001,
      name: 'ProtocolNameTooLong',
      msg: 'Protocol Name Too Long, 50 Characters Maximum.',
    },
    {
      code: 6002,
      name: 'HackerNameEmpty',
      msg: 'Hacker Name Empty.',
    },
    {
      code: 6003,
      name: 'HackerNameTooLong',
      msg: 'Hacker Name Too Long, 50 Characters Maximum.',
    },
    {
      code: 6004,
      name: 'GPGKeyEmpty',
      msg: 'GPG Key Empty.',
    },
    {
      code: 6005,
      name: 'GPGKeyTooSmall',
      msg: 'GPG Key Too Small, 2048 Characters Min.',
    },
    {
      code: 6006,
      name: 'GPGKeyTooBig',
      msg: 'GPG Key Too Big, 4096 characters maximum.',
    },
    {
      code: 6007,
      name: 'MessageEmpty',
      msg: 'Message empty.',
    },
  ],
  metadata: {
    address: 'HATNBZtwk8uLUZeSuYK8QYwWzk1kT5didcGFs9a6GtTW',
  },
}
