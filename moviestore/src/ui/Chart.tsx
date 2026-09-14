import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';

interface DataType {
    name: string;
    value?: number;
}

const Chart = ({ data} : { data: DataType[] }) => {

    const COLORS = ['#B1E5E6','#F7ADAD']

  return (
    <ResponsiveContainer width='100%' height={150}>
        <PieChart>
            <Pie 
            dataKey='value'
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="100%"
            outerRadius='150%'
            labelLine={(props) => (
                <path 
                d={`M${props.points[0].x},${props.points[0].y}L${props.points[1].x},${props.points[1].y}`}
                stroke={COLORS[props.index % COLORS.length]}
                fill='none'
                />
            )}
            label={(props) => (
                <text
                x={props.x}
                y={props.y}
                fill={COLORS[props.index % COLORS.length]}
                fontSize={13}
                fontWeight={600}
                textAnchor={props.textAnchor}
                >
                {props.value}
                </text>
            )}
            shape={(props) => (
                <Sector {...props} fill={COLORS[props.index % COLORS.length]} />
            )}
            />
            <Tooltip contentStyle={{borderRadius: 5, paddingTop: 3, paddingBottom: 3, fontWeight: 650, backgroundColor: 'black', color: 'white', border: '0'}} />
        </PieChart>
        </ResponsiveContainer>
  )
}

export default Chart