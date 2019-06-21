const path = require('path')
const uniq = require('lodash.uniq')
const { Parser } = require('gherkin')
const { readFile, writeFile, mkdir } = require('./utils')

const parser = new Parser()

function createTree(featureSource) {
  const { feature } = parser.parse(featureSource)
  const { children } = feature
  const tree = []

  children.forEach(scenario => {
    scenario.steps.forEach(part => {
      const args = part.text.match(/"\w+"/gm)

      tree.push({
        text: part.text.replace(/"\w+"/gm, '{string}'),
        keyword: part.keyword.trim(),
        args: args ? args.length : 0,
      })
    })
  })

  return tree
}

function createDefArgs(argsCount = 0) {
  if (argsCount === 0) return ''

  return Array(argsCount)
    .fill(0)
    .map((el, i) => `param${i + 1}`)
    .join(', ')
}

function createDefsFromTree(tree) {
  const defs = []
  const keywords = uniq(tree.map(step => step.keyword))

  defs.push(`const { ${keywords.join(', ')} } = require('cucumber')`)

  tree.forEach((step, i) => {
    const args = createDefArgs(step.args)
    const stepDef = [
      `${step.keyword}('${step.text}', function(${args}) {`,
      '  return true',
      '})',
    ]

    defs.push(stepDef.join('\n'))
  })

  return defs.join('\n\n')
}

/**
 * Converts feature sources to steps defs string for next interactions
 * @param {String} featureSource Cucumber feature sources
 * @returns {String} Steps defs file in string
 */
function createDefsFromFeatureSource(featureSource) {
  const tree = createTree(featureSource)

  return createDefsFromTree(tree)
}

/**
 * Converts cucumber feature file from given path and write steps defs file
 * by given path
 * @example
 * convert('features/foo.feature', 'steps').then(() => {
 *   // steps/foo.steps.js was generated
 * })
 * @param {String} featurePath Path to feature file
 * @param {String} outputPath Path for steps defs file output
 * @returns {Promise<void>}
 */
async function convert(featurePath, outputPath) {
  const featureBasename = path.basename(featurePath).replace(/\.feature/, '')
  const featureSource = await readFile(featurePath, 'utf8')
  const stepsPath = path.join(outputPath, `${featureBasename}.js`)
  const defs = createDefsFromFeatureSource(featureSource)

  try {
    await mkdir(path.dirname(stepsPath), {
      recursive: true,
    })
  } catch (err) {}

  await writeFile(stepsPath, defs, 'utf8')
}

module.exports = {
  createTree,
  createDefsFromTree,
  createDefsFromFeatureSource,
  convert,
}
