import { expect } from 'chai'

const withCWD = (cwd, fn) => () => {
  let oldCwd

  before(`set CWD to "${cwd}"`, () => {
    oldCwd = process.cwd()
    process.chdir(cwd)
  })

  fn()

  after('reset CWD', () => {
    process.chdir(oldCwd)
  })
}

const withAdditionalConfigFiles = (files, fn) => () => {
  let oldEnv

  before('set environment variable for additional config files', () => {
    oldEnv = process.env.RPLAN_ADDITIONAL_CONFIG_FILES
    process.env.RPLAN_ADDITIONAL_CONFIG_FILES = files.join(',')
  })

  fn()

  after('reset environment variables', () => {
    process.env.RPLAN_ADDITIONAL_CONFIG_FILES = oldEnv
  })
}

const requireNoCache = (module) => {
  delete require.cache[require.resolve(module)]
  // eslint-disable-next-line global-require,import/no-dynamic-require
  return require(module)
}

describe('rplan-config', () => {
  context('config file in CWD', withCWD('test/fixtures/with-config', () => {
    let config

    beforeEach(() => {
      config = requireNoCache('../../src/index')
    })

    it('should read config from ".rplan-config.yml"', () => {
      expect(config.get('foo')).to.equal(1)
      expect(config.get('bar')).to.equal('Hello World!')
      expect(config.get('nested')).to.deep.equal({
        object: {
          withProperty: 42,
          andList: [
            'a',
            'b',
            'c',
          ],
        },
      })
    })
  }))

  context('config file in CWD and parent', withCWD('test/fixtures/with-config/subdir-with-config', () => {
    let config

    beforeEach(() => {
      config = requireNoCache('../../src/index')
    })

    it('should read config from current dir and ignore config in parent', () => {
      expect(config.get('foo')).to.equal(10)
      expect(config.get('bar')).to.equal('Lorem Ipsum')
      expect(config.get('nested')).to.deep.equal({
        object: 42,
      })
    })
  }))

  context('no config file in CWD', withCWD('test/fixtures/with-config/subdir-without-config', () => {
    let config

    beforeEach(() => {
      config = requireNoCache('../../src/index')
    })

    it('should read config from parent dir', () => {
      expect(config.get('foo')).to.equal(1)
      expect(config.get('bar')).to.equal('Hello World!')
      expect(config.get('nested')).to.deep.equal({
        object: {
          withProperty: 42,
          andList: [
            'a',
            'b',
            'c',
          ],
        },
      })
    })
  }))

  context('no config file in CWD or any parent', withCWD('test/fixtures/without-config', () => {
    // unskip when this module is in its own repository
    it.skip('should throw an error', () => {
      expect(() => {
        // eslint-disable-next-line no-unused-expressions
        requireNoCache('../../src/index')
      }).to.throw(Error)
    })
  }))

  context(
    'with additional config files',
    withCWD(
      'test/fixtures/with-config',
      withAdditionalConfigFiles(
        ['additional-config-1.yml', 'additional-config-2.yml'],
        () => {
          let config

          beforeEach(() => {
            config = requireNoCache('../../src/index')
          })

          it('should overwrite config from ".rplan-config.yml" with additional config files from left to right', () => {
            expect(config.get('foo')).to.equal(3)
            expect(config.get('bar')).to.equal('Hello World!')
            expect(config.get('nested')).to.deep.equal({
              object: {
                withProperty: 'not a number',
                andList: [
                  1,
                  2,
                  3,
                ],
              },
            })
            expect(config.get('newProperty')).to.equal('is cool')
          })
        },
      ),
    ),
  )
})
