import { createElement, Text, Wraper } from './creatElement'

import { Carousel } from './Carousel'
import { Panel } from './Panel'
import { TabPanel } from './TabPanel'
import { ListView } from './ListView'
const compoment = (
  <Carousel data={[
    'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
  ]}
  />
)

// const panel = (
//   <TabPanel title='this is my panel'>
//     <span title='title1'>This is content1</span>
//     <span title='title2'>This is content2</span>
//     <span title='title3'>This is content3</span>
//     <span title='title4'>This is content4</span>
//   </TabPanel>
// )

// window.panel = panel

const data = [
  {
    title: '猫1',
    url: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg'
  },
  {
    title: '猫2',
    url: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg'
  },
  {
    title: '猫3',
    url: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg'
  }, {
    title: '猫4',
    url: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
  }
]

const list = (
  <ListView data={data}>
    {
      record => (
        <figure>
          <img src={record.url} />
          <figcaption>{record.title}</figcaption>
        </figure>
      )
    }

  </ListView>
)

compoment.mountTo(document.body)
// panel.mountTo(document.body)
list.mountTo(document.body)
