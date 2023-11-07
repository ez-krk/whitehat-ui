import HacksBox from './HacksBox'

export default function HacksScreen() {
  return (
    <>
      <div className="content-height flex w-full flex-col items-start justify-start overflow-auto sm:flex-row">
        <HacksBox />
      </div>
    </>
  )
}
